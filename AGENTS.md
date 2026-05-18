# AGENTS.md

## Purpose

This is the first-read routing layer for `/chatbot-widget`, the Lit/Vite embeddable chatbot widget. Global workspace rules live in `/Users/serhiimytakii/Projects/Levantem/AGENTS.md`.

## Start Here

- For detailed execution and validation workflow, read `docs/agents/execution-routing.md`.
- Use this repository for widget UI, partner mode, widget attributes, Shadow DOM styling, guest chat client behavior, and bundle/deployment behavior.
- For backend chat API changes, inspect `/Users/serhiimytakii/Projects/Levantem/tipsterBro-bakend` and make backend edits there.

## Stack Map

- Framework: Lit Web Components.
- Build tool: Vite.
- Language: TypeScript.
- Output: IIFE bundle for third-party embedding.
- Quality sources: `package.json`, `tsconfig.json`, Vite config, and browser verification.

## Non-Negotiables

- Inspect similar modules in `src` before editing.
- Match existing Lit component, service, utility, and styling patterns.
- Preserve widget isolation: do not leak global CSS, dependencies, or browser state into host pages.
- Reuse current helpers and attributes before adding public API.

## Quality And Boundary Preflight

When changing imports, components, services, widget attributes, Shadow DOM styles, bundle behavior, scripts, or backend contract wiring:

1. Read the owning source-of-truth first: nearby `src` files, `README.md`, `package.json`, and `tsconfig.json`.
2. After widget code changes, run `npm run build`.
3. For rendered UI or interaction changes, run the local Vite app and verify the embedded widget in a browser.

## Final Response

State what changed, what was verified, and any unresolved errors or skipped checks.
