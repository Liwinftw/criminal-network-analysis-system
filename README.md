# Criminal Network Analysis System

An AI-powered prototype for exploring and analysing criminal-network relationships using graph analysis, activity anomaly detection, cross-case analysis, and explainable analytical indicators.

> **Prototype / Academic Project:** The included data is fictional. Analytical scores are indicators for investigation support and are not findings of criminality. Results should be reviewed by authorized humans alongside supporting evidence.

---

## Overview

The **Criminal Network Analysis System** combines three major components:

- **React Frontend** for dashboards, interactive network visualisation, person-level analysis, and system status.
- **FastAPI Backend** that connects the frontend with PostgreSQL, Neo4j, and the analysis module.
- **Python Criminal Network Analysis Module** that calculates explainable network-behaviour indicators from relationship, activity, and case data.

The system uses a hybrid database architecture:

- **PostgreSQL** stores people, activities, cases, and person-case associations.
- **Neo4j** stores relationship and network graph data.
- **NetworkX, pandas, and NumPy** support graph and analytical computations.

---

## Key Features

### Interactive Network Visualisation

- Force-directed criminal network graph.
- Interactive node selection.
- Person and connection details.
- Relationship exploration using Neo4j graph data.

### Person-Level Analysis

The system analyses each person using four major indicators:

1. **Brokerage Position**
2. **Coordination Indicators**
3. **Activity Anomaly Detection**
4. **Cross-Case Significance**

### Explainable Analysis

Each analysis profile includes supporting information such as:

- Graph measures.
- Formula contributions.
- Activity baselines.
- Analytical scores.
- Risk/indicator levels.
- Data sufficiency information.

### Backend API

FastAPI provides endpoints for:

- Health checks.
- Person records.
- Network data.
- Individual person analysis.

### System Monitoring

The frontend includes a live backend status page and handles loading, error, and empty states.

---

# System Architecture


                    ┌──────────────────────────────┐
                    │        React Frontend         │
                    │ React + Vite + TypeScript    │
                    │ Tailwind + Recharts + Graph  │
                    └──────────────┬───────────────┘
                                   │ HTTP / Axios
                                   ▼
                    ┌──────────────────────────────┐
                    │        FastAPI Backend        │
                    │   API + Orchestration Layer   │
                    └───────┬──────────┬───────────┘
                            │          │
                ┌───────────▼───┐  ┌───▼──────────┐
                │  PostgreSQL   │  │    Neo4j     │
                │ People        │  │ Relationships│
                │ Activities    │  │ Network Graph│
                │ Cases         │  │              │
                └───────────────┘  └──────┬───────┘
                                           │
                                           ▼
                             ┌────────────────────────┐
                             │ Criminal Network Model │
                             │ Graph Analysis         │
                             │ Anomaly Detection      │
                             │ Coordination Analysis  │
                             │ Cross-Case Analysis    │
                             └────────────────────────┘
```

For individual analysis, the backend retrieves relevant database records and passes the prepared data to the existing `NetworkAnalyzer`. The analytical formulas remain inside the `criminal_network_model` module.

---

# Repository Structure

```text
criminal-network-analysis-system/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analysis.py
│   │   │   ├── network.py
│   │   │   └── persons.py
│   │   │
│   │   ├── database/
│   │   │   ├── neo4j.py
│   │   │   └── postgres.py
│   │   │
│   │   ├── schemas/
│   │   │   └── schemas.py
│   │   │
│   │   ├── services/
│   │   │   ├── analysis_service.py
│   │   │   ├── network_service.py
│   │   │   └── person_service.py
│   │   │
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── scripts/
│   │   └── seed_databases.py
│   │
│   ├── tests/
│   │   └── test_backend_structure.py
│   │
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md
│
├── criminal_network_model/
│   ├── data/
│   │   ├── persons.csv
│   │   ├── relationships.csv
│   │   ├── activities.csv
│   │   └── cases.csv
│   │
│   ├── model/
│   │   ├── graph_builder.py
│   │   ├── brokerage.py
│   │   ├── coordination.py
│   │   ├── anomaly_detection.py
│   │   ├── cross_case.py
│   │   └── network_analyzer.py
│   │
│   ├── tests/
│   │   ├── fixtures/
│   │   └── test_network_analysis.py
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analysis/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   └── network/
│   │   │
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   └── README.md
│
├── pytest.ini
└── .gitignore
```

---

# Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Frontend Libraries | Axios, React Router, React Force Graph 2D, Recharts, Lucide React |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| Relational Database | PostgreSQL |
| Graph Database | Neo4j |
| Analysis | pandas, NumPy, NetworkX |
| Testing | pytest |

---

# Prerequisites

Install the following before running the complete system:

- Python **3.10 or newer**
- Node.js
- npm
- PostgreSQL
- Neo4j

Default local services:

| Service | Default Address |
|---|---|
| PostgreSQL | `localhost:5432` |
| Neo4j | `bolt://localhost:7687` |
| FastAPI Backend | `http://127.0.0.1:8000` |
| Frontend | `http://localhost:5173` |

---

# Installation and Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Liwinftw/criminal-network-analysis-system.git
cd criminal-network-analysis-system
```

---

## 2. Set Up PostgreSQL

Create the database:

```sql
CREATE DATABASE criminal_network;
```

The database tables are created during the seeding process.

---

## 3. Set Up Neo4j

Start a local Neo4j instance.

The default Bolt URI is:

```text
bolt://localhost:7687
```

---

# Backend Setup

## 1. Navigate to the Backend

```bash
cd backend
```

## 2. Create a Virtual Environment

### Windows

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### macOS/Linux

```bash
python -m venv .venv
source .venv/bin/activate
```

## 3. Install Dependencies

```bash
python -m pip install -r requirements.txt
```

## 4. Configure Environment Variables

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=criminal_network
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password

CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

> Do not commit your `.env` file to GitHub.

---

# Seed the Databases

Return to the repository root:

```bash
cd ..
```

Run:

```bash
python backend/scripts/seed_databases.py
```

The seed script loads the fictional data stored in:

```text
criminal_network_model/data/
```

The datasets include:

- Persons
- Relationships
- Activities
- Cases

---

# Run the Backend

Navigate to the backend folder:

```bash
cd backend
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open a new terminal.

## 1. Navigate to the Frontend

```bash
cd frontend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Set the API URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## 4. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# Full Startup Sequence

```text
1. Start PostgreSQL
        ↓
2. Start Neo4j
        ↓
3. Configure backend .env
        ↓
4. Install backend dependencies
        ↓
5. Seed PostgreSQL and Neo4j
        ↓
6. Start FastAPI backend
        ↓
7. Install frontend dependencies
        ↓
8. Start React frontend
        ↓
9. Open http://localhost:5173
```

---

# Backend API

| Endpoint | Description |
|---|---|
| `GET /health` | Check backend health |
| `GET /persons` | Retrieve all person records |
| `GET /persons/{person_id}` | Retrieve a specific person |
| `GET /network` | Retrieve the complete network graph |
| `GET /network/{person_id}` | Retrieve a person and direct connections |
| `GET /analysis/{person_id}` | Run the analysis module for a person |

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Pages

| Route | Description |
|---|---|
| `/dashboard` | System summary and relationship overview |
| `/network` | Interactive force-directed network graph |
| `/analysis/:personId` | Detailed person-level analysis |
| `/status` | Live backend health status |

---

# Analysis Methodology

## 1. Brokerage Position

Brokerage is calculated using normalized **Freeman betweenness centrality**.

A high brokerage score indicates that a person frequently lies on shortest paths between other entities and may act as a bridge between different groups.

---

## 2. Coordination Indicators

The default prototype formula is:

```text
0.4 × Degree Centrality
+ 0.3 × Normalized Interaction Strength
+ 0.3 × Betweenness Centrality
```

The weights are configurable prototype parameters.

---

## 3. Activity Anomaly Detection

The latest activity is compared with earlier activity records using an absolute Z-score.

Default prototype levels:

```text
Z < 2       → NORMAL
2 ≤ Z < 3   → MEDIUM
Z ≥ 3       → HIGH
```

The module also uses safeguards to prevent very small changes from being over-classified.

When insufficient historical activity data is available:

```text
INSUFFICIENT_DATA
```

is returned.

---

## 4. Cross-Case Significance

The default prototype formula is:

```text
0.6 × Normalized Distinct Case Count
+ 0.4 × Betweenness Centrality
```

This indicator combines network importance with the number of distinct cases associated with an entity.

---

# Running the Analysis Module Independently

The analysis module can also run independently.

```bash
cd criminal_network_model
```

Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Run the model:

```bash
python main.py
```

---

# Testing

From the repository root, run:

```bash
python -m pytest criminal_network_model/tests backend/tests
```

The test suite covers:

- Brokerage analysis.
- Coordination indicators.
- Activity anomaly detection.
- Cross-case analysis.
- Unknown person handling.
- Insufficient activity data.
- Backend project structure.

---

# Frontend Production Build

Create a production build:

```bash
cd frontend
npm run build
```

The output is generated in:

```text
frontend/dist/
```

Preview the production build:

```bash
npm run preview
```

---

# Explainability and Responsible Use

This project is designed as an **analytical support system**.

Important considerations:

- Analytical scores are not proof of criminal activity.
- Risk or indicator levels should not be treated as automated decisions.
- The included dataset is fictional and intended for prototype demonstration.
- Data sufficiency is not equivalent to statistical confidence.
- Coordination and cross-case weights are prototype heuristics, not trained machine-learning parameters.
- Results should be interpreted with supporting evidence and reviewed by authorized humans.

---

# Troubleshooting

## PostgreSQL Connection Error

Check:

- PostgreSQL is running.
- The `criminal_network` database exists.
- PostgreSQL credentials in `backend/.env` are correct.

## Neo4j Connection Error

Check:

- Neo4j is running.
- The Bolt URI is correct.
- The Neo4j username and password are correct.

Default URI:

```text
bolt://localhost:7687
```

## Frontend Cannot Reach Backend

Make sure:

```text
FastAPI is running at http://127.0.0.1:8000
```

Check:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Also ensure the backend CORS configuration allows:

```text
http://localhost:5173
```

## Analysis Shows `INSUFFICIENT_DATA`

Some analytical methods require enough historical activity or relationship data. This is an expected result when the available data is insufficient to calculate a reliable prototype indicator.

---

# Contributing

1. Fork or create a branch from the repository.
2. Make changes in the appropriate component:
   - `frontend`
   - `backend`
   - `criminal_network_model`
3. Run the Python tests.
4. Build the frontend.
5. Do not commit secrets or `.env` files.
6. Submit your changes through a pull request.

---

# License

No explicit license is currently declared in the repository.

Add a `LICENSE` file before distributing the project under a specific open-source license.

---

# Project Purpose

The Criminal Network Analysis System demonstrates how **graph databases, relational databases, explainable analytical models, and modern web technologies** can be combined to support the exploration of complex relationship networks.

The system is intended as a prototype for investigation-support and research workflows where human judgment and responsible interpretation remain essential.
