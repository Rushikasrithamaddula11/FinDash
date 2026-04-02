from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from .db import get_database
from .auth import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_database)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    data = db.load()
    user = next((u for u in data["users"] if u["email"] == email), None)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user = Depends(get_current_user)):
    if not current_user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def require_role(role: str):
    async def role_checker(current_user = Depends(get_current_active_user)):
        user_role = current_user.get("role", "viewer")
        roles_hierarchy = {"viewer": 1, "analyst": 2, "admin": 3}
        if roles_hierarchy.get(user_role, 0) < roles_hierarchy.get(role, 0):
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return current_user
    return role_checker
