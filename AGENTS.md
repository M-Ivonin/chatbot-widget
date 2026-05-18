# AGENTS.md

## 1. Project Scope

This file contains app-specific instructions for `/chatbot-widget` (Lit/Vite embeddable chatbot widget).
Global multi-project rules are in `/Users/serhiimytakii/Projects/Levantem/AGENTS.md`.

## 2. Stack and Conventions

- Framework: `Lit` Web Components
- Build tool: `Vite`
- Language: TypeScript
- Output: IIFE bundle for third-party site embedding
- Styling: Shadow DOM styles and existing design tokens in `src/styles`

## 3. Follow Existing Code Style

- Inspect similar modules in `/chatbot-widget/src` before editing.
- Match existing Lit component, service, utility, and styling patterns.
- Preserve widget isolation: avoid leaking global CSS, dependencies, or browser state into host pages.
- Reuse current helpers and attributes before adding new public API.

## 4. Routing

Use this repository for chatbot widget UI, partner mode, widget attributes, Shadow DOM styling, guest chat client behavior, and bundle/deployment behavior.

For backend chat API changes, inspect `/Users/serhiimytakii/Projects/Levantem/tipsterBro-bakend` and make backend edits there.

## 5. Runtime Checks

- Run `npm run build` after widget code changes.
- Run existing lint/test scripts when present and relevant.
- If changing rendered UI or interactions, run the local Vite app and verify the widget in a browser.
