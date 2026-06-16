# Agentic Web App (React + Spring Boot) - Antigravity

This is a web application stub designed for **Agentic Engineering** — cooperative development between human software engineers and autonomous AI agents. The repository structure is optimized to provide clear instructions, constraints, and validation hooks to maximize AI agent productivity and accuracy.

## Repository Structure

```
.
├── CLAUDE.md              # Build, test, and style guide (critical for agents)
├── .cursorrules           # IDE-specific instructions for agents
├── Makefile               # Task runner for dev, test, and build operations
├── README.md              # Project overview
├── agent/                 # Agent engineering files & templates
│   ├── instructions.md    # Detailed Andrej Karpathy coding guidelines
│   ├── task_template.md   # Template for assigning tasks to agents
│   └── workflows/         # Workflows for researching & testing code
├── frontend/              # React frontend (Vite + TypeScript)
└── backend/               # Spring Boot Java backend (Maven Wrapper)
```

---

## Core Guidelines (Karpathy's Rules)

All development (human or AI) must respect the 4 core principles:
1.  **Think Before Coding**: State assumptions, trade-offs, and details before implementing.
2.  **Simplicity First**: Write only what is requested. Avoid over-complicating.
3.  **Surgical Changes**: Restrict changes to targeted files only. No random refactoring.
4.  **Goal-Driven Execution**: Validate all work with automated tests.

---

## Getting Started

### Prerequisites
*   Node.js (v20+ or latest LTS)
*   Java Development Kit (JDK 21 or Java 26)

### Setup & Installation
Initialize the dependencies for both frontend and backend:
```bash
make setup
```

### Running the Application

*   **Start Frontend & Backend Concurrently (Dev profile)**:
    ```bash
    make dev
    ```
    This single command spins up both services (backend on port `8080` with the `dev` profile, and frontend on port `5173`). Pressing `Ctrl+C` will clean up and shut down both servers.

*   **Or run them separately**:
    *   **Start Java Backend**: `make dev-backend`
    *   **Start React Frontend**: `make dev-frontend`

### Running Tests
To run all verification suites (frontend and backend):
```bash
make test
```
