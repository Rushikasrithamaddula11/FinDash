<<<<<<< HEAD
# FinDash
=======
# Finance Dashboard System

A complete full-stack web application for financial data management and dashboard visualization, built with FastAPI, MongoDB, React, Vite, and Tailwind CSS.

## Features

- **Role-Based Access Control (RBAC):** Supports Admin, Analyst, and Viewer roles with strictly enforced data access layers on both frontend and backend.
- **Financial Record Management:** CRUD operations on financial records tracking income/expenses across categories.
- **Aggregated Analytics Engine:** Uses Mongo pipelines to derive key metrics (net balance, income/outings summary, category trends).
- **Modern Responsive UI:** Recharts visualizations, Lucide icons, and heavily styled Tailwind UI components for an ultra-premium aesthetic.

## Architecture & Tech Stack

**Backend:**
- Python 3.12+
- **FastAPI** for high-performance Async APIs.
- **Motor** (asyncio) for non-blocking MongoDB driver connection.
- **Pydantic** for comprehensive schema validation.
- **PyJWT/Passlib** for Bearer token based stateless authentication.

**Frontend:**
- **React (Vite)** for blistering fast rendering and HMR.
- **Tailwind CSS** for comprehensive utility-first styling.
- **Recharts** for engaging dashboard metrics and visual data plotting.
- **Axios** for simplified API interception and standard state handling.

## Running Locally

### 1. Database
Ensure you have MongoDB running locally (default: `mongodb://localhost:27017`). The backend automatically creates the `finance_db` on start.

### 2. Backend
Open a terminal and setup the backend API:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
fastapi dev app/main.py
```
*API will run on http://localhost:8000. You can visit http://localhost:8000/docs for the Swagger UI documentation.*

### 3. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

### Initial Setup & Roles
- The very **first user registered** in the system will automatically be assigned the `admin` role.
- All subsequent users will default to the `viewer` role unless explicitly changed directly in MongoDB.

### Tradeoffs & Design Decisions
1. **Simplified Auth Workflow:** No intricate email verification loop; users are assumed active upon registration for the scope of the assignment.
2. **Global CSS Reset:** Standard `index.css` overrides with Tailwind's preflight for faster bespoke UI layout.
3. **Database Client:** Used AsyncIOMotorClient instead of synchronous pymongo, unlocking full performance from FastAPI endpoints.
>>>>>>> 1b11ec1 (Initial commit: FinDash project with frontend and backend)
