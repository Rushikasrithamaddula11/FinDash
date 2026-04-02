from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..db import get_database
from ..dependencies import require_role
from pydantic import BaseModel

router = APIRouter()

class UserRoleUpdate(BaseModel):
    role: str

class UserStatusUpdate(BaseModel):
    is_active: bool

@router.get("/")
async def list_users(db=Depends(get_database), current_user=Depends(require_role("admin"))):
    data = db.load()
    users = []
    for u in data.get("users", []):
        user_copy = u.copy()
        user_copy.pop("hashed_password", None)
        users.append(user_copy)
    return users

@router.put("/{user_id}/role")
async def update_user_role(user_id: str, update: UserRoleUpdate, db=Depends(get_database), current_user=Depends(require_role("admin"))):
    if update.role not in ["viewer", "analyst", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    data = db.load()
    for i, u in enumerate(data.get("users", [])):
        if u["_id"] == user_id:
            if u["email"] == current_user["email"]:
                raise HTTPException(status_code=400, detail="Cannot change your own role")
            data["users"][i]["role"] = update.role
            db.save(data)
            return {"message": "Role updated successfully", "role": update.role}
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/{user_id}/status")
async def update_user_status(user_id: str, update: UserStatusUpdate, db=Depends(get_database), current_user=Depends(require_role("admin"))):
    data = db.load()
    for i, u in enumerate(data.get("users", [])):
        if u["_id"] == user_id:
            if u["email"] == current_user["email"]:
                raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
            data["users"][i]["is_active"] = update.is_active
            db.save(data)
            return {"message": "Status updated successfully", "is_active": update.is_active}
    raise HTTPException(status_code=404, detail="User not found")
