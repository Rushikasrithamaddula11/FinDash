# 💰 FinDash - Finance Dashboard System

FinDash is a full-stack web application that helps users manage financial data, track income/expenses, and visualize insights through an interactive dashboard.

---

## 🚀 Features

### 🔐 Authentication & Roles
- Secure login/signup using JWT
- Role-Based Access Control (RBAC)
  - **Admin** → Full access (manage users & records)
  - **Analyst** → View records + analytics
  - **Viewer** → View dashboard only

---

### 📊 Financial Management
- Add, update, delete financial records
- Categorize income & expenses
- Track transactions over time

---

### 📈 Dashboard & Insights
- Visual charts using Recharts
- Total income, expenses, and balance
- Category-wise analysis

---

## 🏗️ Tech Stack

### Backend
- FastAPI (Python)
- MongoDB (Database)
- Motor (Async DB driver)
- Pydantic (Validation)
- JWT + Passlib (Authentication)

### Frontend
- React (Vite)
- Tailwind CSS
- Recharts (Charts)
- Axios (API calls)

---

## ⚙️ Project Structure


FinDash/
│
├── backend/
│ ├── app/
│ │ ├── main.py
│ │ ├── auth.py
│ │ ├── db.py
│ │ ├── schemas.py
│ │ ├── dependencies.py
│ │ └── routers/
│ │ ├── auth_router.py
│ │ ├── records_router.py
│ │ └── reports_router.py
│
├── frontend/
│ ├── src/
│ ├── components/
│ ├── pages/
│ └── api/


---

## ▶️ How to Run

### 🟢 1. Start Database
Make sure MongoDB is running:

mongodb://localhost:27017


---

### 🟢 2. Run Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # (Linux/Mac)
venv\Scripts\activate      # (Windows)

pip install -r requirements.txt
uvicorn app.main:app --reload

👉 Backend runs at:
http://localhost:8000

Swagger docs: http://localhost:8000/docs

🟢 3. Run Frontend
cd frontend
npm install
npm run dev

👉 Frontend runs at:
http://localhost:5173

🔑 Role Behavior
Role	Permissions
Admin	Manage users + records
Analyst	View records + analytics
Viewer	View dashboard only
🧠 System Flow
User signs up / logs in
Backend generates JWT token
Frontend stores token
Each API request sends token
Backend verifies role
Access is granted/restricted
⚡ Key Design Decisions
Used FastAPI async for high performance
Used MongoDB for flexible schema
Implemented RBAC for security
Used React + Tailwind for modern UI
📌 Future Improvements
Email verification (OTP)
Password reset system
Advanced analytics (AI insights)
Role management UI for admins
👩‍💻 Author

Rushika Sritha Maddula


---

# 📊 FLOWCHART (PROJECT FLOW)

Here’s a simple flowchart you can understand + even draw in diagrams:

        ┌──────────────┐
        │   User       │
        └──────┬───────┘
               │
    ┌──────────▼──────────┐
    │   Signup / Login    │
    └──────────┬──────────┘
               │
        ┌──────▼──────┐
        │   FastAPI   │
        │ Auth System │
        └──────┬──────┘
               │
       JWT Token Generated
               │
    ┌──────────▼──────────┐
    │  Frontend (React)   │
    │ Stores Token        │
    └──────────┬──────────┘
               │
    API Requests with Token
               │
    ┌──────────▼──────────┐
    │  Role Validation    │
    │ (Admin/Analyst/Viewer)
    └──────────┬──────────┘
               │
 ┌─────────────┼─────────────┐
 │             │             │

┌────▼────┐ ┌────▼────┐ ┌────▼────┐
│ Dashboard│ │ Records │ │ User Mgmt│
└─────────┘ └─────────┘ └─────────┘
│
┌──────▼──────┐
│ MongoDB │
└─────────────┘


