---

description: "Task list for Checkout Console Rebuild"
---

# Tasks: Checkout Console Rebuild

**Input**: Design documents from `/specs/001-svelte-tailwind-rebuild/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Svelte application structure and keep the current root artifacts available as reference files.

- [X] T001 Create the Svelte app scaffold with build entry points in `package.json`, `vite.config.js`, `src/main.js`, and `src/App.svelte`
- [X] T002 [P] Add global Tailwind entry styling in `src/app.css` and wire it through `src/main.js`
- [X] T003 [P] Create shared formatting and date utilities in `src/lib/utils/format.js` and `src/lib/utils/time.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared data access and state model that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Build the business data access layer for catalog, staff, dashboard, transaction search, and write actions in `src/lib/data/service.js`
- [X] T005 [P] Create shared application state for catalog, staff, basket, dashboard, transactions, admin visibility, and notifications in `src/lib/state/app-state.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Complete a Sale (Priority: P1) 🎯 MVP

**Goal**: Let a cashier search items, build a basket, choose staff, and submit a completed sale without changing the current business behavior.

**Independent Test**: Load the app, search for an item, add and adjust quantities in the basket, choose a staff member, submit the sale, and confirm the basket clears and success feedback appears.

### Implementation for User Story 1

- [X] T006 [P] [US1] Build the searchable catalog grid and item card interactions in `src/lib/components/CatalogGrid.svelte`
- [X] T007 [P] [US1] Build the live basket panel with quantity controls and line totals in `src/lib/components/BasketPanel.svelte`
- [X] T008 [US1] Implement sale validation, transaction submission, success feedback, and basket reset in `src/lib/components/CheckoutPanel.svelte`
- [X] T009 [US1] Wire the checkout screen, staff selector, and basket summary into the main layout in `src/App.svelte`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Review Live Status (Priority: P2)

**Goal**: Show live summary information for revenue, transactions, staff, units sold, and the current basket state.

**Independent Test**: Load the app and verify that dashboard metrics, live summary text, and the clock update from current data and basket changes.

### Implementation for User Story 2

- [X] T010 [P] [US2] Build the dashboard summary cards and live clock in `src/lib/components/DashboardSummary.svelte`
- [X] T011 [US2] Connect the dashboard summary and live status fields to the shared application state in `src/App.svelte`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Administer Operational Data (Priority: P3)

**Goal**: Let an authorized operator open the hidden operations console and maintain items, staff, and transaction records.

**Independent Test**: Open the hidden console, add and delete an item, add and delete a staff member, and search transactions by text, date, and staff member.

### Implementation for User Story 3

- [X] T012 [P] [US3] Build the hidden admin modal shell with tab switching and close controls in `src/lib/components/admin/AdminModal.svelte`
- [X] T013 [P] [US3] Build the item maintenance panel in `src/lib/components/admin/ItemsTab.svelte`
- [X] T014 [P] [US3] Build the staff maintenance panel in `src/lib/components/admin/StaffTab.svelte`
- [X] T015 [P] [US3] Build the transaction search panel in `src/lib/components/admin/TransactionsTab.svelte`
- [X] T016 [US3] Wire admin open/close controls and keyboard shortcuts into `src/App.svelte`
- [X] T017 [US3] Connect admin maintenance actions to the data service in `src/lib/data/service.js`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improve consistency, responsiveness, and parity with the current experience across all stories.

- [X] T018 [P] Tighten responsive layout, visual hierarchy, and motion details in `src/app.css`, `src/App.svelte`, `src/lib/components/CatalogGrid.svelte`, `src/lib/components/BasketPanel.svelte`, `src/lib/components/DashboardSummary.svelte`, and `src/lib/components/admin/AdminModal.svelte`
- [X] T019 [P] Verify reference-file parity against `index.html` and `app.css` and adjust rebuilt screens in `src/App.svelte`
- [X] T020 Validate loading, empty, and error states across the rebuilt data flow in `src/lib/data/service.js` and `src/lib/state/app-state.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories
- **User Stories (Phase 3+)**: Depend on completion of the Foundational phase
- **Polish (Final Phase)**: Depends on the desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational and provides the MVP checkout flow
- **User Story 2 (P2)**: Starts after Foundational and may reuse checkout state, but remains independently testable
- **User Story 3 (P3)**: Starts after Foundational and may reuse shared data/state, but remains independently testable

### Within Each User Story

- Build the shared component or state pieces first
- Connect the story into `src/App.svelte`
- Verify the story works on its own before moving to the next priority

### Parallel Opportunities

- `T002` and `T003` can run in parallel after the scaffold exists
- `T005` can run in parallel with `T004` once the service contract is understood
- `T006` and `T007` can run in parallel because they touch different components
- `T010` can run in parallel with the user story 1 work that does not depend on the dashboard
- `T012`, `T013`, `T014`, and `T015` can run in parallel because they are separate admin components
- `T018`, `T019`, and `T020` can run in parallel once the primary flows are stable

---

## Parallel Example: User Story 1

```bash
Task: "Build the searchable catalog grid and item card interactions in `src/lib/components/CatalogGrid.svelte`"
Task: "Build the live basket panel with quantity controls and line totals in `src/lib/components/BasketPanel.svelte`"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the checkout flow independently

### Incremental Delivery

1. Deliver the checkout flow first so the app is usable as soon as possible
2. Add live summary updates next so the main screen reflects current state
3. Add the hidden admin console last because it is operational support, not the core checkout path

### Parallel Team Strategy

1. One developer can own the checkout flow while another builds the shared state and data service
2. Once the foundation is ready, separate developers can take the live summary and admin console in parallel
3. Finish with a shared polish pass across layout, responsiveness, and parity details

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to a specific user story for traceability
- Each user story should be independently completable and testable
- Avoid cross-story coupling that prevents incremental delivery
