# Data Model: Sales Insights Dashboard

## Entities

### Item Row

- `_rowNumber`: spreadsheet row number from Apps Script.
- `item_code`: source item code, not guaranteed unique in the sample data.
- `item_name`: canonical display label for the product.
- `description`: optional product description.
- `unit_price`: item price.

### Staff Row

- `_rowNumber`: spreadsheet row number from Apps Script.
- `name`: staff member name.

### Transaction Row

- `_rowNumber`: spreadsheet row number from Apps Script.
- `transaction_id`: unique sale transaction identifier.
- `date`: transaction date string.
- `time`: transaction time string.
- `staff_name`: staff member associated with the transaction.
- `item_code`: sold item code.
- `item_name`: sold item label.
- `description`: sold item description.
- `unit_price`: per-unit price at sale time.
- `quantity`: units sold.
- `total_price`: line total.

### Dashboard Filters

- `productType`: selected product label or `all`.
- `staffName`: selected staff member name or `all`.

### Dashboard Metrics

- `totalRevenue`
- `totalTransactions`
- `totalUnitsSold`
- `averageOrderValue`
- `topProducts`
- `topStaff`
- `dailySales`
- `filteredTransactions`

### Chart Series

- `revenueTrendSeries`: ordered daily sales values for the line chart.
- `productPerformanceSeries`: aggregated product revenue or quantity for the product chart.
- `staffPerformanceSeries`: aggregated staff revenue or transaction counts for the staff chart.

## Relationships

- One `Item Row` can appear in many `Transaction Row` records.
- One `Staff Row` can appear in many `Transaction Row` records.
- `Dashboard Filters` determine which `Transaction Row` records are included in all derived metrics and chart series.
- `Dashboard Metrics` and `Chart Series` are derived data, recalculated whenever the filter state changes.

## Validation Rules

- Product filter options must be unique and user-facing; prefer `item_name` over `item_code`.
- Staff filter options must be unique by name.
- Empty filter values mean `all`.
- If filters eliminate all transactions, metrics must drop to zero and chart series must become empty rather than throwing.
- Missing descriptions, zero quantities, or missing prices must not break aggregation.
- Dates should be sorted chronologically in trend series.

## View State

### Dashboard Load State

- `loading`: data is still being fetched from Apps Script.
- `ready`: data is available and at least one chart can render.
- `empty`: data loaded successfully, but there are no matching transactions for the current filter set.
- `error`: the Apps Script request failed or returned malformed data.
