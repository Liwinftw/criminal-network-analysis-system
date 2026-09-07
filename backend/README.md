# Criminal Network Analysis Backend

This FastAPI backend is a simple orchestration layer for the SIH prototype. PostgreSQL stores people, activity records, cases, and person-case associations. Neo4j stores the person relationship graph. The existing `criminal_network_model` remains the only place where network-analysis formulas are calculated.

## Architecture

```text
Frontend → FastAPI → PostgreSQL (people, activities, cases)
                    → Neo4j (relationships)
                    → existing NetworkAnalyzer (analysis result)
```

For `GET /analysis/{person_id}`, the backend reads database records, writes short-lived CSV files under `backend/.runtime/`, and passes their paths to the existing `NetworkAnalyzer`. It does not reimplement brokerage, coordination, anomaly, or cross-case formulas.

## Setup

Use Python 3.10 or newer. From `backend/`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` with your local PostgreSQL and Neo4j credentials. Do not commit `.env`.

### PostgreSQL

Install PostgreSQL, then create the database:

```sql
CREATE DATABASE criminal_network;
```

The seed script creates the `persons`, `activities`, `cases`, and `person_cases` tables automatically.

### Neo4j

Start a local Neo4j instance and set its Bolt URI, username, and password in `.env`. The default local Bolt URI is `bolt://localhost:7687`.

## Seed the demo data

With both databases running and `.env` configured, run from the repository root:

```powershell
python backend/scripts/seed_databases.py
```

The script reads the fictional CSV files in `criminal_network_model/data`. It uses PostgreSQL conflict handling and Neo4j `MERGE`, so it is safe to run repeatedly.

## Run the API

From `backend/`:

```powershell
uvicorn app.main:app --reload
```

Open interactive API documentation at `http://127.0.0.1:8000/docs`.

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Returns backend status. |
| `GET /persons` | Returns PostgreSQL person records. |
| `GET /persons/{person_id}` | Returns one person. |
| `GET /network` | Returns Neo4j graph nodes and edges. |
| `GET /network/{person_id}` | Returns a person and direct connections. |
| `GET /analysis/{person_id}` | Runs the existing ML module using database data. |

Database configuration errors and unavailable databases return a safe `500` response. Unknown people return `404`.

## Tests

From the repository root:

```powershell
python -m pytest criminal_network_model/tests backend/tests
```

The backend structure tests do not require running databases. A live PostgreSQL and Neo4j instance are required for seeding and database-backed endpoints.
