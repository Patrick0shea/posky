# Ledger22

**Live demo:** [posky.vercel.app](https://posky.vercel.app)

GMP Annex 22 AI compliance dashboard for pharmaceutical manufacturers.

Tracks AI systems embedded in factory equipment (vision inspection, predictive maintenance, robotics) against the EU's GMP Annex 22 regulation.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6

No backend — all data is hardcoded in `Desktop/pharm/src/data/mockData.ts`.

## Getting Started

```bash
cd Desktop/pharm
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard — metric cards, AI registry table, activity feed |
| `/systems/:id` | System detail — audit trail, documentation packet, classification reasoning |
| `/discovery` | Discovery — connected sources, unregistered systems, add to registry |
