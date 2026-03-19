# AGENTS.md

## 1. Project Scope

This repository is a monorepo with multiple applications:

- `tipsterBro` (Flutter mobile app)
- `tipsterBro-bakend` (NestJS + TypeORM backend)
- `admin-panel` (Next.js web app)

When implementing a task, identify the target app first and run commands from that app directory.
App-specific rules are defined in:

- `/Users/serhiimytakii/Projects/Levantem/tipsterBro/AGENTS.md`
- `/Users/serhiimytakii/Projects/Levantem/tipsterBro-bakend/AGENTS.md`
- `/Users/serhiimytakii/Projects/Levantem/admin-panel/AGENTS.md`

## 2. Follow Existing Code Style (Mandatory)

- Before generating or editing code, inspect similar modules in the same app first.
- Match existing style and patterns for naming, structure, architecture, state management, and error handling.
- Reuse existing project libraries and conventions instead of introducing new patterns by default.

Explicit requirement: **Follow existing code style: Before generating code, look at similar modules in the project. See what styles, patterns, libraries are applied. Use the same in your code.**

## 3. Context7 MCP

- Use Context7 MCP when work depends on latest framework/library documentation or recent API changes.
- Explicitly notify the user whenever Context7 MCP was used, and what was checked.
- If Context7 MCP is unavailable:
  - Say it is unavailable.
  - Fall back to official docs/changelogs for the relevant framework/library.
  - Continue with the safest compatible implementation and call out any uncertainty.

## 4. Runtime Errors Check (Mandatory End-of-Task)

Always do end-of-task build/error verification in the app(s) you changed.

- `tipsterBro`: run `flutter analyze` first. If a Flutter app is already running on simulator/device, prefer attach + `hot reload` / `hot restart` verification via the `flutter-ios-debug` skill instead of a full `flutter build`. Use a full `flutter build` target only when no reusable debug session exists, when the user explicitly asks for a build, or when a build artifact is required.
- `tipsterBro`: before reusing an existing Flutter simulator/device session, inspect the live `flutter run` process and confirm its actual `--dart-define BASE_URL=...` matches the intended backend. Do not assume `.vscode/launch.json` reflects the currently running process.
- `tipsterBro-bakend`: run `npm run build` (and `npm run lint` when backend code changed).
- `admin-panel`: run `npm run build` (and `npm run lint` when code changed).

If a service is already running, do not start duplicate processes.

- Check existing logs/processes first (for example `pm2 list`, `pm2 logs <service> --lines 200`, or the current running terminal logs).
- Start a new process only when no active instance/log stream is available.
- For Flutter UI tasks, if attach + reload/restart is used, navigate to the affected screen when needed, capture a screenshot, and visually confirm the change instead of treating process success alone as sufficient verification.
- For Flutter UI tasks, also confirm the active API environment from the process args, startup log, or in-app debug badge before signing off on environment-sensitive fixes.

In final task output, report verification steps and unresolved runtime/build errors.

## 5. Documentation-First Workflow

- Always check `/docs` first for related feature context before implementation.
- In this monorepo, if root `/docs` does not exist, check the target app docs first:
  - `/tipsterBro/docs`
  - `/tipsterBro-bakend/docs`
- After completing implementation:
  - Update existing docs for behavior changes, or
  - Create a new doc for new features/flows.
- Include updated/created doc paths in the final response.

## 6. Code Review Gate

Use `$code-review` as a post-implementation gate for medium and large changes in this monorepo.

Invoke `$code-review` before the final response when the task includes any of:

- a new feature
- business logic changes across multiple modules
- API contract, DTO, schema, migration, or persistence changes
- auth, permissions, payments, caching, concurrency, background jobs, or shared state changes
- shared UI, navigation, middleware, interceptor, or core service changes that affect multiple flows
- 3 or more changed files with runtime logic

Do not invoke `$code-review` automatically for:

- copy, text, comment, or documentation-only edits
- isolated styling-only changes without runtime behavior changes
- tests-only changes
- simple one-file fixes with low regression risk
- renames, formatting-only edits, or mechanical refactors without behavior changes

When invoked, `$code-review` should:

- automatically fix only critical or high-confidence bugs
- report medium or low-confidence findings with evidence instead of speculative fixes
- ask targeted clarification questions only when the correct fix is ambiguous or risky
