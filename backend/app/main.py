from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth_router, records_router, reports_router, users_router

app = FastAPI(title="Finance Dashboard API")

@app.on_event("startup")
def seed_demo_users():
    from .db import JSONDatabase
    from .auth import get_password_hash
    import uuid
    
    db = JSONDatabase()
    data = db.load()
    if "users" not in data:
        data["users"] = []
    
    existing_emails = {u["email"] for u in data["users"]}
    
    demo_users = [
        {"name": "Admin User", "email": "admin@dash.com", "role": "admin"},
        {"name": "Analyst User", "email": "analyst@dash.com", "role": "analyst"},
        {"name": "Viewer User", "email": "viewer@dash.com", "role": "viewer"}
    ]
    
    added_any = False
    hashed_pwd = None
    
    for du in demo_users:
        if du["email"] not in existing_emails:
            if not hashed_pwd:
                hashed_pwd = get_password_hash("password123")
            data["users"].append({
                "_id": str(uuid.uuid4()),
                "name": du["name"],
                "email": du["email"],
                "hashed_password": hashed_pwd,
                "role": du["role"],
                "is_active": True
            })
            added_any = True
            
    if added_any:
        db.save(data)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Fine for assignment, tighten up for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router.router, prefix="/api/users", tags=["Users"])
app.include_router(records_router.router, prefix="/api/records", tags=["Records"])
app.include_router(reports_router.router, prefix="/api/reports", tags=["Reports"])

@app.get("/")
def root():
    return {"message": "Welcome to the Finance Dashboard API"}
