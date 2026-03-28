# Quickstart: Sales Insights Dashboard

## Prerequisites

- Node.js 20 or newer
- The existing Google Apps Script endpoint configured in `src/lib/data/service.js`

## Install

```bash
npm install
npm install chart.js
```

## Run Locally

```bash
npm run dev
```

Open the app in the local Vite URL and confirm the dashboard loads after the core sheet data fetch completes.

## Verify

```bash
npm run build
```

Use the built app to confirm:

- KPI cards update from the underlying sheet data
- Product and staff filters change all charts together
- Empty filter results show an understandable no-data state
- The page remains usable on smaller screens

## Deployment Notes

- Netlify build command: `npm run build`
- Netlify publish directory: `dist`
- No additional server process is required

