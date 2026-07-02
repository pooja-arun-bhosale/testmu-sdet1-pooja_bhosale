import fs from "node:fs";
import path from "node:path";
import type {
  FullConfig,
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import dotenv from "dotenv";
import {
  explainFailure,
  type FailureContext,
  type FailureReport,
} from "../ai/failureExplainer";

dotenv.config();

const REPORT_PATH = path.join(process.cwd(), "test-results", "ai-report.json");

/**
 * Custom Playwright reporter — invokes Groq ONLY for failed/timed-out tests.
 * LLM calls run in onEnd (async) so Playwright waits for them to finish.
 * LLM errors are caught and logged; they never cause the Playwright run to fail.
 */
class AIReporter implements Reporter {
  private pendingFailures: FailureContext[] = [];
  private reports: FailureReport[] = [];

  onBegin(_config: FullConfig): void {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== "failed" && result.status !== "timedOut") return;

    this.pendingFailures.push({
      testName: test.titlePath().filter(Boolean).join(" > "),
      errorMessage: result.error?.message ?? "Unknown error",
      stackTrace: result.error?.stack,
      url: extractUrl(result),
      timestamp: new Date().toISOString(),
    });
  }

  async onEnd(_result: FullResult): Promise<void> {
    for (const context of this.pendingFailures) {
      try {
        const analysis = await explainFailure(context);
        const report: FailureReport = { ...context, analysis };
        this.reports.push(report);
        printAnalysis(report);
      } catch (err) {
        console.error(
          `[AI Reporter] Groq analysis skipped for "${context.testName}": ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    fs.writeFileSync(REPORT_PATH, JSON.stringify(this.reports, null, 2));

    if (this.reports.length > 0) {
      console.log(
        `\n[AI Reporter] ${this.reports.length} failure(s) analysed — report saved to ${REPORT_PATH}`,
      );
    }
  }
}

function extractUrl(result: TestResult): string {
  const annotation = result.annotations.find((a) => a.type === "page-url");
  if (annotation?.description) return annotation.description;

  const attachment = result.attachments.find((a) => a.name === "page-url");
  if (attachment?.body) return attachment.body.toString("utf-8");

  const match = result.error?.message?.match(/https?:\/\/[^\s"']+/);
  if (match) return match[0];

  return "N/A";
}

function printAnalysis(report: FailureReport): void {
  const line = "=".repeat(72);
  console.log(`\n${line}`);
  console.log("  AI FAILURE Explainer  (Groq / llama-3.3-70b-versatile)");
  console.log(line);
  console.log(`  Test      : ${report.testName}`);
  console.log(`  URL       : ${report.url}`);
  console.log(`  Time      : ${report.timestamp}`);
  console.log(`  Category  : ${report.analysis.classification}`);
  console.log(`  Root cause: ${report.analysis.rootCause}`);
  console.log(`  Fix       : ${report.analysis.suggestedFix}`);
  console.log(`${line}\n`);
}

export default AIReporter;
