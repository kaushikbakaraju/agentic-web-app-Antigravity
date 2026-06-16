# CLAUDE.md

Guidelines, commands, and rules for agents working on this project.

## Project Structure
*   **frontend/**: Vite + React + TypeScript web application.
*   **backend/**: Spring Boot + Java 26 backend.
*   **agent/**: Workflows, guidelines, and templates for agentic engineering.

---

## Build, Test, and Run Commands

### General
*   **Install All Dependencies**: `make setup`
*   **Run All Tests**: `make test`
*   **Run Concurrently (Dev profile)**: `make dev`

### Frontend (React)
*   **Install dependencies**: `cd frontend && npm install`
*   **Run development server**: `cd frontend && npm run dev`
*   **Run tests (Vitest)**: `cd frontend && npm run test` or `npx vitest run`
*   **Build production bundle**: `cd frontend && npm run build`
*   **Lint code**: `cd frontend && npm run lint`

### Backend (Spring Boot / Java)
*   **Build & compile**: `cd backend && ./mvnw clean compile`
*   **Run tests**: `cd backend && ./mvnw clean test`
*   **Run development server**: `cd backend && ./mvnw spring-boot:run`
*   **Package app (JAR)**: `cd backend && ./mvnw clean package`

---

## Coding Style & Architecture

### React / Frontend
*   Use TypeScript for all components and utility functions.
*   Write modular CSS components using standard CSS variables defined in `src/index.css`.
*   Prefer functional components with hooks.
*   Keep components clean, readable, and highly reusable.
*   Use Vitest for component testing.

### Java / Backend
*   Use Java 26 standards and features.
*   Follow standard Spring Boot patterns: Controller -> Service -> Repository.
*   Use Constructor Injection (`@RequiredArgsConstructor` or standard constructor) rather than field injection (`@Autowired`).
*   Ensure proper exception handling and return standard REST response structures (e.g. including error messages, status codes).
*   Write JUnit 5 tests with descriptive assertions.

---

## Behavioral Guidelines (Andrej Karpathy's Principles)

To maintain high quality, reliability, and predictability, all agents must adhere to the following core guidelines:

1.  **Think Before Coding**
    *   Never rush into writing code.
    *   State your assumptions, clarify uncertainties, and outline tradeoffs before implementing changes.
    *   Confirm your understanding of requirements rather than making silent design choices.
2.  **Simplicity First**
    *   Implement the minimum necessary code to solve the user's specific request.
    *   Do not add unnecessary abstractions, hypothetical utilities, or unrequested features.
    *   Keep systems clean and easily readable.
3.  **Surgical Changes**
    *   Modify only the files and lines necessary to complete the task.
    *   Do not perform wide-scale refactoring or format code unrelated to the task, as it clutters diffs and introduces risk.
4.  **Goal-Driven Execution**
    *   Define objective success criteria before writing code (e.g., failing test cases).
    *   Run tests/compilation loops until verified. Fix any compiler or test errors before declaring a task done.
