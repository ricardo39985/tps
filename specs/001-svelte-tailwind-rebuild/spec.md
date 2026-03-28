# Feature Specification: Checkout Console Rebuild

**Feature Branch**: `001-svelte-tailwind-rebuild`  
**Created**: 2026-03-28  
**Status**: Draft  
**Input**: User description: "This entire project needs to be rebuilt in Svelte with Tailwind CSS. Keep `index.html` and `app.css` in the project permanently as reference files. Recreate the full project using Svelte and Tailwind CSS. All functionality must continue to work exactly as it does now. The UI can be adjusted or improved where needed, but the core requirement is that behavior and functionality remain unchanged."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete a Sale (Priority: P1)

A cashier can browse the catalog, search for products, build a basket, select a staff member, and submit a completed sale without losing any of the current checkout behavior.

**Why this priority**: This is the primary business workflow and the main reason the application exists.

**Independent Test**: Load the application, search for an item, add it to the basket, change the quantity, select a staff member, and submit the transaction. Verify that the sale is accepted and the basket is cleared afterward.

**Acceptance Scenarios**:

1. **Given** a loaded catalog and an empty basket, **When** the cashier taps an item card, **Then** the item appears in the basket and the displayed totals update immediately.
2. **Given** items already in the basket, **When** the cashier increases, decreases, or removes a line item, **Then** the basket quantities and totals stay correct after each change.
3. **Given** one or more items in the basket and a staff member selected, **When** the cashier submits the sale, **Then** the application records the transaction and resets the current basket.
4. **Given** the basket is empty or no staff member is selected, **When** the cashier tries to submit, **Then** the application prevents submission and explains what is missing.

---

### User Story 2 - Review Live Status (Priority: P2)

A cashier can see live summary information that reflects the current state of sales, items, staff, and the active basket.

**Why this priority**: The live summary helps users confirm the checkout state and understand store activity without leaving the main screen.

**Independent Test**: Load the application and verify that dashboard totals, item counts, and active basket summaries appear and update when the underlying data or basket changes.

**Acceptance Scenarios**:

1. **Given** the application has loaded data, **When** the main screen is displayed, **Then** the dashboard shows current revenue, transaction count, staff count, and units sold.
2. **Given** the cashier changes the basket, **When** the basket contents change, **Then** the live sale summary updates to match the new basket state.
3. **Given** the application is open for more than a minute, **When** the live clock is visible, **Then** the displayed date and time continue to refresh.

---

### User Story 3 - Administer Operational Data (Priority: P3)

An authorized operator can access the hidden operations console to maintain items, staff, and transaction records.

**Why this priority**: This supports store maintenance and troubleshooting, but it is secondary to the core checkout flow.

**Independent Test**: Open the hidden admin console, add and delete an item, add and delete a staff member, and search transactions by text, date, and staff member.

**Acceptance Scenarios**:

1. **Given** the main screen is visible, **When** the operator uses the admin access control, **Then** the operations console opens.
2. **Given** the operations console is open, **When** the operator adds or deletes an item or staff member, **Then** the relevant list updates and the change is reflected in the interface.
3. **Given** the operations console is open, **When** the operator searches transactions by text, date, or staff member, **Then** the results list shows only matching transactions.
4. **Given** the operations console is open, **When** the operator closes it or presses the escape key, **Then** the console closes and the main screen remains usable.

### Edge Cases

- No items are available in the catalog.
- A search returns no matching items or no matching transactions.
- A basket contains one item with a quantity of one and the user decreases it to zero.
- The user tries to submit a sale without selecting a staff member.
- The user tries to submit a sale with an empty basket.
- The connected data source is unavailable or returns incomplete data.
- The admin console is opened and closed repeatedly while the main screen remains active.

## Assumptions

- The rebuilt experience must preserve the current checkout, summary, and admin workflows even if the visual design changes.
- `index.html` and `app.css` remain in the repository as reference artifacts for behavior and styling parity during the rebuild.
- The existing data model for items, staff, transactions, and dashboard totals remains authoritative for the rebuilt experience.
- Hidden admin access remains available through the current operator access pattern.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST present the current product catalog on the main screen.
- **FR-002**: Users MUST be able to search the catalog by item name, item code, or description.
- **FR-003**: Users MUST be able to add a catalog item to the current basket from the main screen.
- **FR-004**: Users MUST be able to increase, decrease, and remove basket items before submission.
- **FR-005**: The application MUST show the current basket total and item quantity as the basket changes.
- **FR-006**: The application MUST require both a non-empty basket and a selected staff member before a sale can be submitted.
- **FR-007**: When a sale is submitted, the application MUST record every basket line item as part of the same transaction.
- **FR-008**: The application MUST clear the current basket after a successful sale submission.
- **FR-009**: The application MUST display clear feedback when submission cannot continue or when a submission succeeds.
- **FR-010**: The application MUST show current dashboard totals for revenue, transaction count, staff count, and units sold.
- **FR-011**: The application MUST provide a hidden operations console for authorized maintenance tasks.
- **FR-012**: The operations console MUST allow authorized users to add and remove items.
- **FR-013**: The operations console MUST allow authorized users to add and remove staff members.
- **FR-014**: The operations console MUST allow authorized users to search transactions by text, date, and staff member.
- **FR-015**: The application MUST allow the operations console to be opened and closed without disrupting the main checkout flow.
- **FR-016**: The application MUST keep the existing reference files available for parity checks during the rebuild.

### Key Entities *(include if feature involves data)*

- **Catalog Item**: A sellable product with a code, name, description, and unit price.
- **Basket Line**: A selected item in the current sale with a quantity and line total.
- **Staff Member**: A person who can be associated with a sale.
- **Transaction**: A completed sale record containing a transaction identifier, date, time, staff member, item details, quantity, and total value.
- **Dashboard Summary**: A snapshot of overall revenue, transaction volume, staff count, and units sold.

## Dependencies

- A working data source must provide current catalog, staff, dashboard, and transaction information.
- Maintenance actions must be able to persist changes so that updates remain visible after refresh or reload.
- Search and filtering must operate on the same underlying transaction records used by the summary and admin views.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of sampled users can complete a standard sale, including search, basket changes, staff selection, and submission, in under 2 minutes.
- **SC-002**: In validation testing, displayed basket totals and quantities match the final basket state in 100% of checked sale scenarios.
- **SC-003**: In validation testing, the dashboard and admin views reflect the current data set with no missing records in at least 99% of refresh checks.
- **SC-004**: At least 90% of sampled users can open the operations console, complete one maintenance task, and close it again without assistance.
- **SC-005**: Transaction searches by text, date, and staff return the expected matching records in at least 95% of verification cases.
