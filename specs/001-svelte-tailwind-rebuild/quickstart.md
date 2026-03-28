# Quickstart: Checkout Console Rebuild

## Prerequisites

- Node.js installed
- Access to the repository root

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local browser address printed by the dev server and verify:

- Product search works
- Basket totals update as items change
- Staff selection is required for submission
- Successful submission clears the basket
- The hidden operations console opens and closes correctly

## Test

```bash
npm run test
```

Run browser-level verification for the main checkout and admin flows before planning implementation completion.

## Build

```bash
npm run build
```

## Reference Files

- Keep `index.html` and `app.css` in the repository as parity references during implementation.
- Use them to confirm that the rebuilt UI preserves the current user-visible behavior even if the layout is refreshed.
