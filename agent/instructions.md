# Agentic Engineering Guidelines: Andrej Karpathy's Principles

This document provides detailed behavioral instructions for AI agents working in this repository. These rules are adapted from Andrej Karpathy's reflections on LLM coding failure modes.

## 1. Think Before Coding
*   **Action**: Before modifying any code, write a short explanation of what you plan to do. State your assumptions, any constraints, potential edge cases, and design trade-offs.
*   **Why**: Rushing to code often leads to incorrect architectures or assumptions that require extensive rewrites.
*   **Rule**: Start every task by documenting your understanding and plan, and if necessary, request clarification before writing a single line of production code.

## 2. Simplicity First
*   **Action**: Keep changes minimal, clean, and direct. Do not add abstractions (e.g. wrapper classes, custom interfaces, utility helpers) unless explicitly required.
*   **Why**: Agents tend to overcomplicate tasks by introducing "good practice" boilerplate that is unnecessary for the problem at hand, increasing code complexity and technical debt.
*   **Rule**: Implement the simplest solution that satisfies the requirement. Avoid planning for speculative future needs.

## 3. Surgical Changes
*   **Action**: Limit your changes exclusively to the files and scopes relevant to the task.
*   **Why**: Large, sweeping changes or minor cleanups of unrelated files clutter pull request diffs, break unrelated functionality, and make code reviews difficult.
*   **Rule**: Never format or "clean up" unrelated sections of code. Keep git diffs as small and focused as possible.

## 4. Goal-Driven Execution
*   **Action**: Prioritize verifiability. Define how success will be measured before starting (e.g., writing a test case first, or defining a strict set of verification steps).
*   **Why**: Without automated validation, agents can write code that compiles but is logically broken.
*   **Rule**: Run compilation and tests continuously. If you make a change, verify it with a unit, integration, or E2E test. Never submit code without running the relevant test suite first.
