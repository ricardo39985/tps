# Implementation Plan: Checkout Console Rebuild

**Branch**: `001-svelte-tailwind-rebuild` | **Date**: 2026-03-28 | **Spec**: [/home/rick/code/tps/specs/001-svelte-tailwind-rebuild/spec.md](/home/rick/code/tps/specs/001-svelte-tailwind-rebuild/spec.md)
**Input**: Feature specification from `/specs/001-svelte-tailwind-rebuild/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Rebuild the existing checkout and admin console as a Svelte web app styled with Tailwind CSS, preserving the current item search, basket management, transaction submission, dashboard summary, and hidden operations console workflows while keeping `index.html` and `app.css` in the repository as permanent reference artifacts.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript (ES2022) with Svelte 5  
**Primary Dependencies**: Svelte, Tailwind CSS, Vite, Vitest, Playwright  
**Storage**: Remote Google Sheets-backed data service; no local persistent state  
**Testing**: Unit tests for state and formatting, browser integration checks for key flows, and end-to-end checks for checkout/admin behavior  
**Target Platform**: Modern desktop and mobile browsers  
**Project Type**: Web application  
**Performance Goals**: Basket, totals, and dashboard updates should feel immediate to the user; modal open/close should be smooth and non-blocking  
**Constraints**: Preserve current user-visible behavior, maintain hidden admin access, and keep reference files available for parity checks  
**Scale/Scope**: Single-page checkout surface with one hidden operations console, four dashboard metrics, and catalog/staff/transaction management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Preserve current business workflows and user-visible behavior. **Pass**
- Keep the implementation focused as a single web app rather than splitting into unnecessary services. **Pass**
- Add automated verification for the checkout, summary, and admin flows. **Pass**
- Keep `index.html` and `app.css` in the repo as reference artifacts. **Pass**
- Document the external data contract before implementation begins. **Pass**

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
index.html          # Reference artifact retained for parity checks
app.css             # Reference artifact retained for parity checks
src/
├── main.js
├── App.svelte
├── app.css
├── lib/
│   ├── components/
│   ├── state/
│   ├── data/
│   └── utils/
└── routes/         # Optional if the app grows beyond a single surface

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Single Svelte web application with all runtime code in `src/`, browser-facing verification in `tests/`, and root-level `index.html` and `app.css` preserved as reference files for behavior and styling parity.
