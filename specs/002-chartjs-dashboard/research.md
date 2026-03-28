# Research: Sales Insights Dashboard

## Decision 1: Use Chart.js directly inside Svelte components

- Decision: Add Chart.js as the charting library and wrap each chart in a dedicated Svelte component with lifecycle-managed chart instances.
- Rationale: Chart.js is a good fit for common analytics visuals, keeps the visual language familiar, and lets the app control updates explicitly when filters change.
- Alternatives considered:
  - `svelte-chartjs`: simpler integration, but adds a thin wrapper layer without solving the underlying data-update model.
  - Custom SVG charts: possible, but slower to build and harder to keep consistent across multiple chart types.

## Decision 2: Compute filtered analytics client-side from row-level sheet data

- Decision: Fetch `Items`, `Staff`, and `Transactions`, then derive the dashboard metrics and chart series in the Svelte app after applying product and staff filters.
- Rationale: The Apps Script exposes an unfiltered summary endpoint, but the dashboard needs scoped views by product and staff. Client-side aggregation avoids changing the script contract and keeps the feature responsive.
- Alternatives considered:
  - Add new Apps Script endpoints for filtered summaries: more server logic and more deployment work for a dashboard-only need.
  - Use `getDashboardSummary` alone: insufficient because it cannot answer filtered product/staff views.

## Decision 3: Treat product type as the canonical product label from the sheet data

- Decision: Build product filter options from the unique `item_name` values in the item/transaction data, and use `item_code` only as supporting metadata.
- Rationale: The sample data does not include a real category column, and `item_code` is not a safe unique key. `item_name` is clearer to managers and produces usable filters immediately.
- Alternatives considered:
  - Group by `item_code`: rejected because duplicate codes can exist and are not user-friendly.
  - Infer categories from descriptions or name prefixes: useful as a fallback, but too brittle to be the primary model.
  - Require a new category column in Sheets: accurate, but not available in the current data source.

## Decision 4: Use a single shared filter state for all charts and KPIs

- Decision: Apply the selected product type and staff member to the same filtered transaction set, then feed every chart and summary card from that subset.
- Rationale: This keeps the dashboard coherent. Users should see the whole page update together instead of mixing filtered and unfiltered panels.
- Alternatives considered:
  - Chart-specific filters: confusing and harder to reason about.
  - Only filter the currently visible chart: does not satisfy the requirement to refine the dashboard view.

## Decision 5: Build an insight-first dashboard layout

- Decision: Prioritize KPI cards, a revenue trend line, product performance bars, and staff performance bars, with filter controls above the charts and a no-results state below them.
- Rationale: These views answer the most useful manager questions quickly: how much sold, which products lead, which staff lead, and how sales move over time.
- Alternatives considered:
  - Dense table-first layout: harder to scan and weaker for trend recognition.
  - Single chart only: too little context for a usable dashboard.
