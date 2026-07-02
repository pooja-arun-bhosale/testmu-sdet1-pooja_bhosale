# AI Usage Log

| AI Tool | Task | What it Produced |
|---------|------|-------------------|
| Claude | Project setup & repository structure | Designed the initial project structure, including `tests/` (login, dashboard, api), `src/ai/`, `src/reporters/`, `specs/`, and supporting project files such as `README.md`, `prompts.md`, `ai-usage-log.md`, and `.env.example`. |
| GitHub Copilot (Playwright Agents) | Test planning, generation & healing | Used the Planner agent to generate test plans, the Generator agent to create Playwright test files, and the Healer agent to diagnose and resolve generated test failures by improving locators, assertions, waits, environment configuration, and timeouts. |
| ChatGPT | Technical guidance, debugging & documentation | Clarified assignment requirements, explained Playwright concepts, resolved environment and configuration issues (`.env`, `process.env`, `tsconfig`, navigation timeout, GitHub Actions, API authentication), refined Planner/Generator/Healer prompts, reviewed implementations, documented application limitations, and assisted with documentation, Git workflow, and code reviews. |
| Cursor | Task 3 implementation | Implemented the LLM integration (Option A – Failure Explainer) using the Groq API, including the Groq client, prompt generation, failure analysis module, custom Playwright reporter, AI response handling, and JSON report generation. |
| Kiro | Final review, optimization & documentation | Reviewed the Cursor-generated implementation against the assignment requirements, identified missing improvements, suggested code optimizations, verified the final solution, and generated the project `README.md` following standard GitHub documentation practices. |

---

## Task 2: Prompt Engineering

- Used GitHub Copilot Playwright Planner to generate test plans for the Login, Dashboard, and API modules.
- Used the Generator agent to generate Playwright automation from the approved test plans.
- Used the Healer agent to diagnose and resolve generated test failures.
- Used ChatGPT to refine prompts, explain generated code, troubleshoot environment issues, validate test scenarios, and document application limitations.

---

## Task 3: LLM Integration

- Implemented **Option A – Failure Explainer** using the Groq API.
- Used Cursor to implement the Groq client, prompt generation, failure analysis module, and custom Playwright reporter.
- Used ChatGPT to review the architecture, validate the implementation, explain the execution flow, and verify alignment with the assignment requirements.
- Used Kiro to perform a final implementation review, suggest optimizations, verify requirement coverage, and generate a professional `README.md`.

### Documentation Prompt [For Redme file creation (Kiro)]


Review the repository and create a clean, professional `README.md` based on the current implementation. Follow standard GitHub README structure, including: Project Overview, Features, Project Structure, Prerequisites, Installation, Environment Setup, Running the Tests, Task 2 (Prompt Engineering), Task 3 (LLM Integration), Future Improvements, and AI Usage. Keep it concise, well-organized, accurately reflect the repository without adding unsupported features, and document the project using the latest stable Playwright version and current industry best practices.
