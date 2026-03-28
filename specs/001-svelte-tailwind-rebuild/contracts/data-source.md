# Data Source Contract: Checkout Console Rebuild

## Overview

The application depends on a business data source that provides catalog, staff, dashboard, and transaction records and accepts maintenance and submission actions.

## Read Operations

### Catalog

- Returns the current item list.
- Each record includes item code, item name, description, price, and source row identifier.

### Staff

- Returns the current staff list.
- Each record includes staff name and source row identifier.

### Dashboard Summary

- Returns revenue, transaction count, staff count, and units sold.

### Transactions

- Returns the current transaction list for the admin console.
- Supports filtering by text, date, and staff member.

## Write Operations

### Submit Sale

- Accepts one sale composed of one or more basket lines.
- Requires a transaction identifier, date, time, staff member, item details, quantity, and total value for each line.

### Add Item / Remove Item

- Adds or removes a catalog item from the source data set.

### Add Staff / Remove Staff

- Adds or removes a staff member from the source data set.

### Remove Transaction

- Deletes a transaction record from the data set.

## Shared Response Expectations

- Success responses must clearly indicate success.
- Failure responses must include an explanatory error message that can be shown to the user.
- Returned data must be sufficient for the main checkout screen and the admin console to render without additional transformation beyond formatting.
