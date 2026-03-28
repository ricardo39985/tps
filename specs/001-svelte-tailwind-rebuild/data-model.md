# Data Model: Checkout Console Rebuild

## Entities

### Catalog Item

- **Purpose**: Represents a sellable product shown on the main screen.
- **Fields**:
  - `item_code`: Unique product identifier shown to users.
  - `item_name`: Display name for the product.
  - `description`: Short user-facing description.
  - `unit_price`: Price per unit.
  - `_rowNumber`: Source record identifier used for maintenance actions.
- **Validation Rules**:
  - Item code, name, and price are required for creation.
  - Price must be a valid numeric value greater than zero.
- **Relationships**:
  - Can become a Basket Line when selected for checkout.
  - Can be removed from the catalog in the operations console.

### Basket Line

- **Purpose**: Represents one selected catalog item in the current sale.
- **Fields**:
  - `item_code`
  - `item_name`
  - `description`
  - `unit_price`
  - `quantity`
  - `line_total`
- **Validation Rules**:
  - Quantity must remain at one or above while present in the basket.
  - Removing the last unit removes the line entirely.
- **Relationships**:
  - Derived from one Catalog Item.
  - Included in the eventual Transaction payload.

### Staff Member

- **Purpose**: Represents a person who can be assigned to a sale.
- **Fields**:
  - `name`
  - `_rowNumber`
- **Validation Rules**:
  - Staff name is required for creation.
  - The selected staff member must exist in the current staff list before sale submission.
- **Relationships**:
  - Can be associated with many Transactions.

### Transaction

- **Purpose**: Represents a completed sale record.
- **Fields**:
  - `transaction_id`
  - `date`
  - `time`
  - `staff_name`
  - `item_code`
  - `item_name`
  - `description`
  - `unit_price`
  - `quantity`
  - `total_price`
  - `_rowNumber`
- **Validation Rules**:
  - A transaction must contain at least one line item.
  - Each line item must retain the staff member and timestamp of the parent sale.
- **Relationships**:
  - Aggregates one or more Basket Lines at submission time.
  - Feeds the dashboard summary and transaction search results.

### Dashboard Summary

- **Purpose**: Represents the live headline metrics shown on the main screen.
- **Fields**:
  - `total_revenue`
  - `total_transactions`
  - `total_staff`
  - `total_units_sold`
- **Validation Rules**:
  - Values must be numeric and non-negative.
- **Relationships**:
  - Derived from the transaction and staff records.

## State Transitions

- **Basket state**: empty -> building -> ready to submit -> submitted -> empty
- **Admin console state**: closed -> open -> closed
- **Transaction search state**: unfiltered -> filtered by text/date/staff -> reset

## Derived Rules

- Basket totals must always equal the sum of line quantities multiplied by unit price.
- Dashboard values must stay consistent with the current record set.
- Search filters must only narrow results; they must not mutate the underlying transaction records.
