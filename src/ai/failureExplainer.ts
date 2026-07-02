/**
 * WHY OPTION A (Failure Explainer) over Option B (Flaky Test Classifier):
 * Option A fires immediately after each failed test, giving developers
 * actionable root-cause + fix suggestions without waiting for the full run
 * to finish. It maps cleanly onto Playwright's onTestEnd reporter hook and
 * keeps the feedback loop tight. Option B requires log aggregation after the
 * entire suite, which is better suited for CI analytics dashboards — not for
 * in-the-moment debugging.
 */

import { chatCompletion } from "./llm";

export interface FailureContext {
  testName: string;
  errorMessage: string;
  stackTrace?: string;
  url: string;
  timestamp: string;
}

export interface AIAnalysis {
  rootCause: string;
  suggestedFix: string;
  classification: "Test Issue" | "Environment Issue" | "Product Bug";
}

export interface FailureReport extends FailureContext {
  analysis: AIAnalysis;
}

const SYSTEM_PROMPT = `You are a senior QA engineer analyzing Playwright test failures.
Respond ONLY with valid JSON using this exact shape:
{
  "rootCause": "brief explanation of why the test failed",
  "suggestedFix": "concrete steps to fix the failure",
  "classification": "Test Issue | Environment Issue | Product Bug"
}
Use exactly one of the three classification values listed above.`;

function buildUserPrompt(ctx: FailureContext): string {
  return [
    "Analyze this Playwright test failure and return ONLY the JSON object described.",
    "",
    `Test name:     ${ctx.testName}`,
    `Timestamp:     ${ctx.timestamp}`,
    `Current URL:   ${ctx.url}`,
    "",
    "Error message:",
    ctx.errorMessage,
    "",
    "Stack trace:",
    ctx.stackTrace ?? "Not available",
  ].join("\n");
}

function parseAnalysis(raw: string): AIAnalysis {
  let parsed: Partial<AIAnalysis>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Groq returned non-JSON: ${raw.slice(0, 200)}`);
  }

  if (!parsed.rootCause || !parsed.suggestedFix || !parsed.classification) {
    throw new Error(
      "Groq response missing required fields (rootCause, suggestedFix, classification).",
    );
  }

  return {
    rootCause: parsed.rootCause,
    suggestedFix: parsed.suggestedFix,
    classification: parsed.classification,
  };
}

/**
 * Calls Groq with the failure context and returns structured AI analysis.
 * Throws on API or parse errors — callers should catch and log rather than
 * propagate (we must never fail the Playwright run due to LLM issues).
 */
export async function explainFailure(ctx: FailureContext): Promise<AIAnalysis> {
  const raw = await chatCompletion({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: buildUserPrompt(ctx),
  });
  return parseAnalysis(raw);
}
