# Chatbot Widget Execution Routing

Use this file after `AGENTS.md` when the task needs implementation details.

## Local Evidence First

- Read `README.md`, `package.json`, `tsconfig.json`, and nearby files in `src` before editing.
- Inspect similar Lit components, services, utilities, and styles before introducing new patterns.
- Prefer local code and browser behavior over assumptions about embedding hosts.

## Widget Boundaries

- Preserve Shadow DOM isolation and avoid global CSS side effects.
- Keep the output suitable for third-party embedding as an IIFE bundle.
- Avoid leaking dependencies, browser state, or implementation details into host pages.
- Treat widget attributes as public API; reuse existing attributes before adding new ones.
- Backend API contract changes belong in `/Users/serhiimytakii/Projects/Levantem/tipsterBro-bakend`.

## Validation Commands

Use `package.json` as the command source of truth.

- Standard code change: `npm run build`.
- UI or interaction change: run `npm run dev` and verify the widget in a browser.
- This repo currently has no lint or test scripts in `package.json`; do not report them as run unless they are added.

If a Vite server is already running, reuse it or inspect its output instead of starting duplicates.

## Documentation Updates

Update `README.md` or a focused doc when changing public attributes, embedding behavior, deployment assumptions, or backend contract expectations.
