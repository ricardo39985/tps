# Implementation Plan: Sales Insights Dashboard

**Branch**: `002-chartjs-dashboard` | **Date**: 2026-03-28 | **Spec**: `/home/rick/code/tps/specs/002-chartjs-dashboard/spec.md`
**Input**: Feature specification from `/specs/002-chartjs-dashboard/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a Chart.js-powered sales dashboard to the existing Svelte/Vite/Tailwind app so managers can review revenue, transaction volume, product performance, and staff performance, then refine the view by product type and staff member without leaving the page. Because the Apps Script only provides raw sheet rows and unfiltered summaries, the dashboard will fetch `Items`, `Staff`, and `Transactions`, build filtered aggregates client-side, and render responsive charts and KPI cards from that derived dataset.

## Technical Context

**Language/Version**: JavaScript with Svelte 5 and Vite 6  
**Primary Dependencies**: Svelte, Vite, Tailwind CSS 4, Chart.js  
**Storage**: Google Sheets via Apps Script JSONP/POST endpoint; no local persistence  
**Testing**: `npm run build` plus browser smoke checks; add targeted unit or component tests if the dashboard logic is split further  
**Target Platform**: Modern desktop and mobile web browsers  
**Project Type**: Single-page web application  
**Performance Goals**: Dashboard filters should feel immediate for typical sheet sizes and chart redraws should stay within a normal interactive frame budget  
**Constraints**: Must respect the existing Apps Script contract, handle duplicate or sparse item labels, and continue to work when summary arrays are empty  
**Scale/Scope**: Small-to-medium POS dataset centered on a few sheets, with dashboard charts derived from transactions and filterable by product and staff

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- No active project-specific constitution rules are defined in `.specify/memory/constitution.md`; the file is still a template, so there are no blocking policy conflicts to resolve.
- The feature stays inside the existing single-project Svelte app and does not introduce a second backend or extra service layer.
- The implementation will use the current Google Sheets data contract as the source of truth and will not alter the Apps Script schema.
- The dashboard will preserve existing checkout and admin behavior while adding a new analytics surface.

## Project Structure

### Documentation (this feature)

```text
specs/002-chartjs-dashboard/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── App.svelte
├── main.js
├── app.css
└── lib/
    ├── components/
    │   ├── DashboardSummary.svelte
    │   └── dashboard/
    │       ├── DashboardFilters.svelte
    │       ├── ProductPerformanceChart.svelte
    │       ├── StaffPerformanceChart.svelte
    │       └── SalesTrendChart.svelte
    ├── data/
    │   └── service.js
    ├── state/
    │   └── app-state.js
    └── utils/
        ├── format.js
        └── time.js
```

**Structure Decision**: Keep the feature in the existing single Svelte web app under `src/`, adding dashboard-specific components and analytics helpers beneath `src/lib/components/dashboard/` and `src/lib/state/` rather than introducing a separate frontend/backend split.

## Complexity Tracking

No constitution violations require justification.
