# Research Workflow

Follow this procedure when researching a new task or exploring the codebase.

## 1. Locate Entry Points
*   For frontend changes, start with `frontend/src/main.tsx` and trace page routes or UI hierarchies.
*   For backend changes, start with the REST controllers in `backend/src/main/java/com/antigravity/agenticapp/controller/` and trace downstream services.

## 2. Identify Dependencies
*   Check `frontend/package.json` for frontend npm libraries.
*   Check `backend/pom.xml` for backend Maven dependencies.
*   Verify that you do not add redundant libraries.

## 3. Map File Dependencies
*   Trace how files import or call each other.
*   Document the list of files that will be impacted by your changes.

## 4. Document Findings
*   Write a summary of your findings in your task plan or task scratchpad.
*   Explain how the existing codebase behaves and where your changes will slot in.
