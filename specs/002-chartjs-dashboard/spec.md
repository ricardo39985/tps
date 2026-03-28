# Feature Specification: Sales Insights Dashboard

**Feature Branch**: `002-chartjs-dashboard`  
**Created**: 2026-03-28  
**Status**: Draft  
**Input**: User description: "We need a dashboard feature using Chart.js. Review the Apps Script I provided so you can understand the data structure. I can also provide example entries for each data type to help you assess what would make the dashboard genuinely useful. The dashboard should support filtering and adjustment by product type and by staff member. Users should be able to view and refine the dashboard based on those dimensions. Use your judgment to design a dashboard that is intuitive, usable, and presents meaningful insights from the data with Chart.js. \"TPS Transactions.xlsx\" is a sample of the sheets."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review Performance at a Glance (Priority: P1)

A manager can open the dashboard and immediately understand store performance through a clear summary of revenue, transaction activity, product performance, staff performance, and recent sales trends.

**Why this priority**: This is the core value of the dashboard; without an overview, the dashboard does not provide business insight.

**Independent Test**: Open the dashboard on a dataset with transactions and verify that the main metrics and charts load, are readable, and reflect the underlying sheet data.

**Acceptance Scenarios**:

1. **Given** the transactions sheet contains records, **When** the dashboard loads, **Then** the user sees the current totals for revenue, transactions, units sold, and staff coverage.
2. **Given** the dashboard loads data successfully, **When** the user views the main analytics area, **Then** they can see charts that summarize product performance, staff performance, and sales over time.
3. **Given** the dashboard has recent transaction data, **When** the user inspects the page, **Then** they can identify the top-performing products and staff without leaving the dashboard.

---

### User Story 2 - Refine by Product Type (Priority: P2)

A manager can narrow the dashboard to a product type so they can compare product families and focus on a specific part of the business.

**Why this priority**: Product-level analysis is one of the primary decisions the dashboard should support.

**Independent Test**: Select a product type filter and verify that the charts and summary figures update to show only the matching subset of data.

**Acceptance Scenarios**:

1. **Given** multiple product types exist in the data, **When** the user selects one product type, **Then** the dashboard updates to show metrics and charts for that product scope only.
2. **Given** a product type filter is active, **When** the user changes to another product type, **Then** the dashboard refreshes to reflect the newly selected type without requiring a page reload.
3. **Given** a product type filter is active, **When** the user clears the filter, **Then** the dashboard returns to the full-data view.

---

### User Story 3 - Refine by Staff Member (Priority: P3)

A manager can narrow the dashboard to a staff member so they can compare staff performance and view the sales patterns associated with a specific person.

**Why this priority**: Staff analysis helps identify operational performance and complements product-focused insights.

**Independent Test**: Select a staff member filter and verify that the charts and summary figures update to show only that staff member’s matching transactions.

**Acceptance Scenarios**:

1. **Given** multiple staff members exist in the data, **When** the user selects one staff member, **Then** the dashboard updates to show metrics and charts for that staff member only.
2. **Given** a staff filter is active, **When** the user changes to another staff member, **Then** the dashboard refreshes to reflect the newly selected staff member without requiring a page reload.
3. **Given** a staff filter is active, **When** the user clears the filter, **Then** the dashboard returns to the full-data view.

### Edge Cases

- No transactions exist yet.
- A selected product type has no matching transactions for the chosen period.
- A selected staff member has no matching transactions.
- The dataset includes products with no description or sparse labels.
- Multiple items share similar names, making product grouping ambiguous.
- Filters are combined in a way that leaves no matching records.
- The dashboard data source returns only partial aggregates or empty arrays.

## Assumptions

- Product type is derived from the existing item and transaction labels in the sheet data; if no explicit category field exists, the dashboard groups by the available product name or equivalent product label.
- The dashboard is intended to help managers analyze existing transactions rather than to edit sales data.
- The dashboard should favor readability and decision support over dense raw tables.
- The underlying sheet data remains the source of truth for totals, product groupings, and staff performance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dashboard MUST display a high-level performance overview including revenue, transaction count, units sold, and staff coverage.
- **FR-002**: The dashboard MUST present visual charts that summarize product performance, staff performance, and sales trends.
- **FR-003**: The dashboard MUST show the top-performing products and top-performing staff members in a way that is easy to compare at a glance.
- **FR-004**: Users MUST be able to filter the dashboard by product type.
- **FR-005**: Users MUST be able to filter the dashboard by staff member.
- **FR-006**: The dashboard MUST update all relevant summaries and charts when filters change.
- **FR-007**: Users MUST be able to clear filters and return to the unfiltered dashboard view.
- **FR-008**: The dashboard MUST handle empty or partial datasets without breaking the page.
- **FR-009**: The dashboard MUST make it clear when the selected filters produce no matching records.
- **FR-010**: The dashboard MUST remain understandable on both larger and smaller screens.

### Key Entities *(include if feature involves data)*

- **Transaction Record**: A single sale entry containing date, time, staff member, product label, quantity, and total sale value.
- **Product Type**: A product grouping used for comparison and filtering; when no explicit category exists, this is derived from the available product label in the sheet data.
- **Staff Member**: The person associated with one or more transaction records.
- **Dashboard Filter State**: The current product type and staff member selections that control the view.
- **Performance Summary**: Aggregated totals and rankings derived from the transaction records.
- **Trend Series**: Daily or time-based sales values used to show how activity changes over time.

## Dependencies

- The transactions sheet must contain sale records with product, staff, date, quantity, and total sale value fields.
- The items sheet must provide a stable product label list for grouping and filtering.
- The staff sheet must provide the staff member list for filter options.
- The dashboard must be able to calculate or receive aggregate totals from the underlying sheet data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of sampled users can identify the top-performing product type and top-performing staff member within 60 seconds of opening the dashboard.
- **SC-002**: At least 90% of sampled users can apply a product filter and a staff filter and understand the updated results without assistance.
- **SC-003**: When a filter is changed, the dashboard updates the visible insights fast enough that users perceive the change as immediate in normal use.
- **SC-004**: In verification testing, the dashboard correctly reflects the expected totals and rankings for the selected filter scope in 100% of checked scenarios.
- **SC-005**: In empty-data tests, the dashboard still loads a complete, understandable empty state with no broken charts or blocked interactions.
