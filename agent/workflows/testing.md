# Testing and Verification Workflow

This document details the validation steps required before marking a task complete.

## 1. Unit Testing
*   **Java Backend**: Write JUnit 5 test classes. Place them in the corresponding package under `backend/src/test/java/`. Use Mockito for mocking external services. Run `./mvnw clean test` to verify.
*   **React Frontend**: Write Vitest tests. Place them next to the components they test (e.g., `App.test.tsx` or in `tests/`). Run `npm run test` to verify.

## 2. Integration Testing
*   Verify integration between backend APIs and frontend UI by launching both local servers.
*   Ensure that CORS settings on the backend permit local frontend connections (typically `http://localhost:5173`).
*   Mock backend APIs on the frontend only when backend servers are not available.

## 3. Check for Side Effects
*   Verify that your modifications did not break unrelated tests.
*   Review your `git diff` before committing:
    ```bash
    git diff --stat
    ```
*   Ensure no debugging lines (`console.log`, temporary prints) remain in the code.
