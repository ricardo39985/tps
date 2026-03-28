# Data Source Contract

## Overview

The dashboard consumes the existing Google Apps Script endpoint through JSONP `GET` requests for reads and JSON `POST` requests for writes. The dashboard feature itself is read-heavy: it loads rows from `Items`, `Staff`, and `Transactions`, then derives chart data and filter-scoped metrics in the client.

## Read Actions

### `getItems`

Response:

```json
{
  "success": true,
  "items": [
    {
      "_rowNumber": 2,
      "item_code": "C001",
      "item_name": "Classic Cheesecake",
      "description": "Cheesecake",
      "unit_price": 35
    }
  ]
}
```

### `getStaff`

Response:

```json
{
  "success": true,
  "staff": [
    {
      "_rowNumber": 2,
      "name": "Ricardo"
    }
  ]
}
```

### `getTransactions`

Response:

```json
{
  "success": true,
  "transactions": [
    {
      "_rowNumber": 2,
      "transaction_id": "TX-001",
      "date": "2026-03-28",
      "time": "10:15",
      "staff_name": "Ricardo",
      "item_code": "C001",
      "item_name": "Classic Cheesecake",
      "description": "Cheesecake",
      "unit_price": 35,
      "quantity": 1,
      "total_price": 35
    }
  ]
}
```

### `getDashboardSummary`

Response:

```json
{
  "success": true,
  "dashboard": {
    "total_items": 0,
    "total_staff": 0,
    "total_transactions": 0,
    "total_units_sold": 0,
    "total_revenue": 0,
    "top_products": [],
    "top_staff": [],
    "daily_sales": [],
    "recent_transactions": []
  }
}
```

The dashboard can use this endpoint as a coarse summary, but filter-aware charts must still be computed from row-level data.

### `searchTransactions`

Query parameters supported by the script:

- `query`
- `staff_name`
- `date`
- `transaction_id`

Response:

```json
{
  "success": true,
  "transactions": []
}
```

## Write Actions

The dashboard does not need these for display, but it must not break the existing app flows that depend on them:

- `createItem`
- `createStaff`
- `createTransaction`
- `createTransactionBatch`
- `createItemBatch`
- `deleteItem`
- `deleteStaff`
- `deleteTransaction`

## Client-Side Dashboard Contract

- The client must treat `item_name` as the primary product grouping label unless a future sheet column provides a real category field.
- Product filters are derived from unique product labels in the fetched item/transaction data.
- Staff filters are derived from unique `staff_name` values in the fetched transaction data, with the staff sheet used as the source list for selector options.
- All dashboard charts and KPI cards must react to the same filter state.
- If the Apps Script response is empty or partially populated, the dashboard must render a valid empty state rather than fail the page.
