# Tasks: Sales Insights Dashboard

**Input**: Design documents from `/specs/002-chartjs-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested explicitly in the feature spec, so only implementation tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dashboard-specific dependencies

- [x] T001 Add Chart.js to the app dependencies in `/home/rick/code/tps/package.json`
- [x] T002 Create the dashboard component folder structure under `/home/rick/code/tps/src/lib/components/dashboard/`
- [x] [P] T003 Add a shared chart registration helper in `/home/rick/code/tps/src/lib/charts/chartjs.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared dashboard data and rendering primitives that every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Build dashboard aggregation and filter helpers in `/home/rick/code/tps/src/lib/state/dashboard-state.js`
- [x] [P] T005 Add a normalization helper for product and staff labels in `/home/rick/code/tps/src/lib/utils/dashboard.js`
- [x] [P] T006 Create a reusable Chart.js Svelte wrapper component in `/home/rick/code/tps/src/lib/components/dashboard/ChartCanvas.svelte`
- [x] T007 Add a dashboard mount slot and placeholder container above checkout in `/home/rick/code/tps/src/App.svelte`

**Checkpoint**: Core dashboard data flow and chart shell are ready; user story work can now begin.

---

## Phase 3: User Story 1 - Review Performance at a Glance (Priority: P1) 🎯 MVP

**Goal**: Show a useful dashboard overview with KPI cards and meaningful charts that summarize revenue, products, staff, and sales trends.

**Independent Test**: Load the dashboard with sheet data and confirm that KPI cards, a revenue trend chart, a product performance chart, and a staff performance chart render correctly without any filters applied.

### Implementation for User Story 1

- [x] [P] [US1] T008 Build the dashboard KPI card row in `/home/rick/code/tps/src/lib/components/dashboard/DashboardKpis.svelte`
- [x] [P] [US1] T009 Build the revenue trend chart in `/home/rick/code/tps/src/lib/components/dashboard/RevenueTrendChart.svelte`
- [x] [P] [US1] T010 Build the product performance chart in `/home/rick/code/tps/src/lib/components/dashboard/ProductPerformanceChart.svelte`
- [x] [P] [US1] T011 Build the staff performance chart in `/home/rick/code/tps/src/lib/components/dashboard/StaffPerformanceChart.svelte`
- [x] [US1] T012 Compose the full dashboard overview panel in `/home/rick/code/tps/src/lib/components/dashboard/DashboardOverview.svelte` and mount it in `/home/rick/code/tps/src/App.svelte`

**Checkpoint**: User Story 1 should now be fully functional and usable as the MVP dashboard.

---

## Phase 4: User Story 2 - Refine by Product Type (Priority: P2)

**Goal**: Let users narrow every dashboard metric and chart to a chosen product type.

**Independent Test**: Select a product type and verify that the KPI cards and charts all update to the matching product subset, then clear the filter and confirm the full dataset returns.

### Implementation for User Story 2

- [x] [P] [US2] T013 Add a product type filter control in `/home/rick/code/tps/src/lib/components/dashboard/DashboardFilters.svelte`
- [x] [US2] T014 Wire product-type selection into the shared filter state in `/home/rick/code/tps/src/lib/state/dashboard-state.js`
- [x] [US2] T015 Apply product-type filtering to the derived KPI and chart data in `/home/rick/code/tps/src/lib/state/dashboard-state.js`
- [x] [US2] T016 Add empty-state and clear-filter behavior for product filtering in `/home/rick/code/tps/src/lib/components/dashboard/DashboardOverview.svelte`

**Checkpoint**: Product filtering should now work end-to-end without affecting the rest of the app.

---

## Phase 5: User Story 3 - Refine by Staff Member (Priority: P3)

**Goal**: Let users narrow every dashboard metric and chart to a chosen staff member and compare performance across staff.

**Independent Test**: Select a staff member and verify that the KPI cards and charts all update to the matching staff subset, then combine it with a product filter and confirm the intersection behaves correctly.

### Implementation for User Story 3

- [x] [P] [US3] T017 Add a staff member filter control in `/home/rick/code/tps/src/lib/components/dashboard/DashboardFilters.svelte`
- [x] [US3] T018 Wire staff selection into the shared filter state in `/home/rick/code/tps/src/lib/state/dashboard-state.js`
- [x] [US3] T019 Apply staff-member filtering to the derived KPI and chart data in `/home/rick/code/tps/src/lib/state/dashboard-state.js`
- [x] [US3] T020 Add combined-filter no-results handling and a clear-all action in `/home/rick/code/tps/src/lib/components/dashboard/DashboardOverview.svelte`

**Checkpoint**: Staff filtering should now work independently and in combination with product filtering.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass across the dashboard and existing app integration

- [x] [P] T021 Refine responsive layout, spacing, and chart sizing for `/home/rick/code/tps/src/lib/components/dashboard/*.svelte`
- [x] T022 Improve accessibility labels, loading text, and no-data messaging in `/home/rick/code/tps/src/lib/components/dashboard/DashboardFilters.svelte` and `/home/rick/code/tps/src/lib/components/dashboard/DashboardOverview.svelte`
- [x] T023 Validate the dashboard build and runtime behavior with `npm run build` from `/home/rick/code/tps`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phases 3-5)**: Depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on later stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - builds on the same shared dashboard state
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - also builds on the same shared dashboard state

### Within Each User Story

- Shared state and helpers before UI composition
- Charts before page composition
- Filters before filter-specific refinement tasks
- Core implementation before polish

### Parallel Opportunities

- `T003` and `T005` can run in parallel because they touch different files.
- `T006` can run alongside `T004` and `T005` once the file structure exists.
- In User Story 1, the KPI card, revenue chart, product chart, and staff chart tasks can be worked on in parallel across different files.
- In User Story 2, the filter control and filter-state update tasks can proceed in parallel after the shared dashboard state exists.
- In User Story 3, the staff control and the no-results handling tasks can proceed in parallel after the shared dashboard state exists.

---

## Parallel Example: User Story 1

```bash
Task: "Build the dashboard KPI card row in /home/rick/code/tps/src/lib/components/dashboard/DashboardKpis.svelte"
Task: "Build the revenue trend chart in /home/rick/code/tps/src/lib/components/dashboard/RevenueTrendChart.svelte"
Task: "Build the product performance chart in /home/rick/code/tps/src/lib/components/dashboard/ProductPerformanceChart.svelte"
Task: "Build the staff performance chart in /home/rick/code/tps/src/lib/components/dashboard/StaffPerformanceChart.svelte"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the overview dashboard with the existing sheet data
5. Stop and demo if the core insights are working

### Incremental Delivery

1. Complete Setup + Foundational work
2. Deliver User Story 1 as the base dashboard
3. Add product-type filtering in User Story 2
4. Add staff-member filtering in User Story 3
5. Finish with polish and accessibility fixes

### Parallel Team Strategy

1. One developer can wire the shared dashboard state while another sets up the Chart.js wrapper
2. Once the foundation is done, separate developers can implement the KPI cards and each chart independently
3. Product filter and staff filter work can proceed in parallel after the dashboard overview shell exists

---

## Notes

- `[P]` tasks = different files, no dependencies
- `[Story]` label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Use the existing Apps Script endpoints and derive filter-aware metrics client-side
