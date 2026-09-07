# Frontend — AI-Powered Criminal Network Analysis System

SIH 26189 · React + Vite + TypeScript + Tailwind CSS

---

## Overview

This is the React frontend for the Criminal Network Analysis System.  
It connects to the existing FastAPI backend and visualises:

- Interactive force-directed network graph (Neo4j data)
- Per-person analytical profiles (brokerage, coordination, activity anomaly, cross-case significance)
- Explainable flag reasoning with ethical disclaimers
- Data sufficiency indicators
- Live backend health status

---

## Prerequisites

Make sure the following are running **before** starting the frontend:

| Service | Default address |
|---|---|
| PostgreSQL | `localhost:5432` |
| Neo4j | `bolt://localhost:7687` |
| FastAPI backend | `http://127.0.0.1:8000` |

Seed the databases first:

```bash
cd backend
python scripts/seed_databases.py
```

Start the backend:

```bash
cd backend
uvicorn app.main:app --reload
```

---

## Installation

```bash
cd frontend
npm install
```

---

## Environment Variables

Copy the example file and edit as needed:

```bash
cp .env.example .env
```

`.env` contents:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## Running (development)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Production Build

```bash
npm run build
```

Output is placed in `frontend/dist/`.  
Preview the production build:

```bash
npm run preview
```

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/        # Sidebar, Header
│   │   ├── common/        # LoadingState, ErrorState, EmptyState, Tooltip, LevelBadge
│   │   ├── dashboard/     # SummaryCard
│   │   ├── network/       # NetworkGraph, NetworkControls, NodeDetails
│   │   └── analysis/      # BrokerageCard, CoordinationCard, ActivityAnomalyCard,
│   │                      # CrossCaseCard, FlagExplanation, DataSufficiency
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── NetworkAnalysis.tsx
│   │   ├── PersonAnalysis.tsx
│   │   └── SystemStatus.tsx
│   ├── services/
│   │   └── api.ts          # All backend API calls (centralised)
│   ├── hooks/
│   │   └── useApi.ts       # Generic loading/error data-fetching hook
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces matching backend schemas
│   └── utils/
│       ├── levelColors.ts  # Colour helpers for LOW/MEDIUM/HIGH levels
│       └── graphTransform.ts # Backend NetworkResponse → react-force-graph-2d shape
├── .env                    # Local environment variables (gitignored)
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Pages

| Route | Description |
|---|---|
| `/dashboard` | Summary cards, entity list, relationship overview |
| `/network` | Interactive force graph with node selection and details panel |
| `/analysis/:personId` | Full ML analysis profile for a selected entity |
| `/status` | Live backend health check |

---

## Full Startup Sequence

```
1. Start PostgreSQL
          ↓
2. Start Neo4j
          ↓
3. cd backend && python scripts/seed_databases.py
          ↓
4. cd backend && uvicorn app.main:app --reload
          ↓
5. cd frontend && npm run dev
          ↓
6. Open http://localhost:5173
```

---

## Tech Stack

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool and dev server |
| TypeScript 5 | Type safety |
| Tailwind CSS 3 | Styling |
| React Router 6 | Client-side routing |
| Axios | HTTP client |
| react-force-graph-2d | Interactive network graph |
| Recharts | Activity anomaly bar chart |
| Lucide React | Icons |

---

## Notes

- The backend and ML model files are **not modified** by this frontend.
- All API calls are centralised in `src/services/api.ts`.
- Analysis results are displayed as-is from the backend — no data is fabricated.
- Risk levels (LOW / MEDIUM / HIGH) use colour coding: green / amber / red respectively.
- All analytical observations include ethical disclaimers per system requirements.
