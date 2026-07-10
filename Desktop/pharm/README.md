# Ledger22

GMP Annex 22 AI compliance dashboard for pharmaceutical manufacturers.

Tracks AI systems embedded in factory equipment (vision inspection, predictive maintenance, robotics) against the EU's GMP Annex 22 regulation.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6

No backend — all data is hardcoded in `src/data/mockData.ts`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Vercel

Push to GitHub, then import the repo in Vercel. The included `vercel.json` handles SPA routing rewrites automatically. No additional configuration needed.

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard — metric cards, AI registry table, activity feed |
| `/systems/:id` | System detail — audit trail, documentation packet, classification reasoning |
| `/discovery` | Discovery — connected sources, unregistered systems, add to registry |

## Editing Seed Data

All mock data lives in `src/data/mockData.ts`. Edit the `systems`, `activityFeed`, and `discoverySources` arrays to change what's displayed.
