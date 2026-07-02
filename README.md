# Playwright Test Suite with AI Failure Analysis

End-to-end test suite using **Playwright v1.61.1** and TypeScript, covering OrangeHRM UI flows and ReqRes REST API scenarios. Includes a custom Playwright reporter (Task 3) that calls the **Groq LLM** on every test failure and saves a structured AI analysis to `test-results/ai-report.json`.

---

## Tech Stack

| Tool                                                | Version                                   |
| --------------------------------------------------- | ----------------------------------------- |
| [@playwright/test](https://playwright.dev)          | 1.61.1 (latest)                           |
| TypeScript                                          | ^6.0.3                                    |
| Node.js                                             | 18+                                       |
| [openai SDK](https://github.com/openai/openai-node) | ^6.45.0                                   |
| Groq model                                          | llama-3.3-70b-versatile                   |
| VS code                                             | VS Code v1.105 (released October 9, 2025) |

---

## Project Structure

```
.
├── .github/
│   ├── agents/
│   │   ├── playwright-test-generator.agent.md
│   │   ├── playwright-test-healer.agent.md
│   │   └── playwright-test-planner.agent.md
│   └── workflows/
│       ├── copilot-setup-steps.yml
│       └── playwright.yml
├── specs/
│   ├── api.md
│   ├── dashboard.md
│   └── login.md
├── src/
│   ├── ai/
│   │   ├── failureExplainer.ts
│   │   └── llm.ts
│   └── reporters/
│       └── aiReporter.ts
├── tests/
│   ├── api/
│   │   └── api.spec.ts
│   ├── dashboard/
│   │   └── dashboard.spec.ts
│   ├── login/
│   │   └── login.spec.ts
│   └── seed.spec.ts
├── .env.example
├── .gitignore
├── ai-usage-log.md
├── package.json
├── playwright.config.ts
├── prompts.md
├── README.md
└── tsconfig.json
```

---

## Prerequisites

- **Node.js 18+**
- **Groq API key** — free at [console.groq.com](https://console.groq.com)
- **ReqRes API key** — free at [reqres.in](https://reqres.in)

---

## Installation

```bash
npm install
npm init playwright@latest
npx playwright init-agents --loop=vscode.     (Installing playwrite agents)
```

---

## Environment Setup

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# OrangeHRM demo
URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
USERNAME=Admin
PASSWORD=admin123

# ReqRes API
API_BASE_URL=https://reqres.in/
API_EMAIL=eve.holt@reqres.in
API_PASSWORD=cityslicka
REQRES_API_KEY=your_reqres_api_key

# Groq — required for AI failure analysis (Task 3)
GROQ_API_KEY=your_groq_api_key
```

> If `GROQ_API_KEY` is absent the reporter logs a warning and skips analysis without failing the run.

---

## Running Tests

```bash
# Full suite
npx playwright test

# Individual modules
npx playwright test tests/login
npx playwright test tests/dashboard
npx playwright test tests/api

# Open HTML report after any run
npx playwright show-report
```

---

## Task 2 — Prompt Engineering

Tests were generated using three GitHub Copilot agent roles. All prompts are recorded in [`prompts.md`](./prompts.md).

| Agent         | Role                                                                     |
| ------------- | ------------------------------------------------------------------------ |
| **Planner**   | Explored the app and produced structured test plans saved under `specs/` |
| **Generator** | Converted test plans into Playwright TypeScript test files               |
| **Healer**    | Re-ran failing tests, diagnosed root causes, and applied fixes           |

### Modules

**Login** — `tests/login/login.spec.ts`
Valid credentials, wrong username, wrong password, empty fields, error message validation.

**Dashboard** — `tests/dashboard/dashboard.spec.ts`
Widget loading and visibility, filter/sort behavior, responsive layout (1280 / 768 / 480 px), permission-based content.

**API** — `tests/api/api.spec.ts`
Authentication (success + failure), full CRUD on `/users`, 404 / 400 error handling, rate-limit detection, JSON schema validation.

---

## Task 3 — LLM Integration (Option A: Failure Explainer)

**Why Option A over Option B (Flaky Test Classifier):**
Option A fires immediately after each failed test via `onTestEnd`, giving actionable feedback without waiting for the full suite to finish. Option B requires aggregating all logs after a complete run and is better suited for CI analytics pipelines.

### How it works

```
Test fails
  → aiReporter.ts (onTestEnd)
    → failureExplainer.ts (builds prompt)
      → llm.ts (Groq API call)
        → JSON analysis printed to console
        → appended to test-results/ai-report.json
```

**Context sent to Groq per failure:**
test name · error message · stack trace · current page URL · timestamp

### AI response shape

```json
{
  "rootCause": "...",
  "suggestedFix": "...",
  "classification": "Test Issue | Environment Issue | Product Bug"
}
```

### Sample console output

```
========================================================================
  AI FAILURE ANALYSIS  (Groq / llama-3.3-70b-versatile)
========================================================================
  Test      : demo failure triggers Groq failure analysis
  URL       : about:blank
  Time      : 2025-07-03T10:22:11.000Z
  Category  : Test Issue
  Root cause: The expected heading element does not exist in the DOM.
  Fix       : Update the locator to match actual page content.
========================================================================
```

Full report saved to `test-results/ai-report.json`.

---

## CI

GitHub Actions at `.github/workflows/playwright.yml` runs on push / PR to `main`.
Add `GROQ_API_KEY` and `REQRES_API_KEY` as repository secrets to enable AI analysis in CI.

---

## Limitations

- OrangeHRM is a shared public demo — data changes between runs; assertions cover element visibility, not data accuracy.
- Groq free tier has per-minute token limits — errors are caught and logged without failing the test run.

---

## AI Usage

Full details in [`ai-usage-log.md`](./ai-usage-log.md).

| Tool                               | Used for                                                |
| ---------------------------------- | ------------------------------------------------------- |
| GitHub Copilot (Playwright Agents) | Task 2 — test planning, generation, and healing         |
| ChatGPT                            | Debugging, prompt refinement, environment configuration |
| Cursor                             | Task 3 — initial LLM integration implementation         |
| Kiro                               | Task 3 — code review, optimization, and README          |
