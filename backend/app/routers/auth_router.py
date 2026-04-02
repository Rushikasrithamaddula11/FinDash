from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from uuid import uuid4
from ..db import get_database
from ..schemas import UserCreate, UserResponse, Token, UserInDB, OTPRequest, OTPVerify, RoleSelect, PasswordReset, PasswordSetup
from ..auth import get_password_hash, verify_password, create_access_token
from ..dependencies import get_current_user
from ..email_service import generate_otp, send_otp_email

router = APIRouter()

@router.post("/request-otp")
async def request_otp(otp_request: OTPRequest, db=Depends(get_database)):
    data = db.load()
    if "otps" not in data:
        data["otps"] = {}
        
    otp = generate_otp()
    data["otps"][otp_request.email] = otp
    db.save(data)
    
    send_otp_email(otp_request.email, otp)
    return {"message": f"OTP sent to {otp_request.email}"}

@router.post("/verify-otp", response_model=Token)
async def verify_otp(otp_data: OTPVerify, db=Depends(get_database)):
    data = db.load()
    
    if "otps" not in data or data["otps"].get(otp_data.email) != otp_data.otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    del data["otps"][otp_data.email]
    
    user = next((u for u in data["users"] if u["email"] == otp_data.email), None)
    
    if user:
        access_token = create_access_token(
            data={"sub": user["email"], "role": user.get("role", "viewer")}
        )
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        new_user_dict = {
            "name": otp_data.email.split("@")[0],
            "email": otp_data.email,
            "role": "pending",
            "hashed_password": get_password_hash("otp_generated_random_123456"),
            "is_active": True,
            "_id": str(uuid4())
        }
        data["users"].append(new_user_dict)
        db.save(data)
        access_token = create_access_token(
            data={"sub": new_user_dict["email"], "role": "pending"}
        )
        return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password-otp")
async def forgot_password_otp(otp_request: OTPRequest, db=Depends(get_database)):
    data = db.load()
    user = next((u for u in data["users"] if u["email"] == otp_request.email), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if "otps" not in data:
        data["otps"] = {}
        
    otp = generate_otp()
    data["otps"][otp_request.email] = otp
    db.save(data)
    
    send_otp_email(otp_request.email, otp)
    return {"message": "Password reset OTP sent"}

@router.post("/reset-password")
async def reset_password(req: PasswordReset, db=Depends(get_database)):
    data = db.load()
    if "otps" not in data or data["otps"].get(req.email) != req.otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    user_idx = next((i for i, u in enumerate(data["users"]) if u["email"] == req.email), None)
    if user_idx is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    data["users"][user_idx]["hashed_password"] = get_password_hash(req.new_password)
    del data["otps"][req.email]
    db.save(data)
    return {"message": "Password updated successfully"}

@router.post("/select-role", response_model=Token)
async def select_role(role_data: RoleSelect, current_user=Depends(get_current_user), db=Depends(get_database)):
    if current_user.get("role") != "pending":
        raise HTTPException(status_code=400, detail="Role already assigned")
        
    if role_data.role not in ["viewer", "analyst"]:
        raise HTTPException(status_code=400, detail="Invalid role selection")
        
    data = db.load()
    user_idx = next((i for i, u in enumerate(data["users"]) if u["email"] == current_user["email"]), None)
    if user_idx is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    data["users"][user_idx]["role"] = role_data.role
    db.save(data)
    
    # Generate new token with correct role
    access_token = create_access_token(
        data={"sub": current_user["email"], "role": role_data.role}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/setup-password")
async def setup_password(setup_data: PasswordSetup, current_user=Depends(get_current_user), db=Depends(get_database)):
    data = db.load()
    user_idx = next((i for i, u in enumerate(data["users"]) if u["email"] == current_user["email"]), None)
    if user_idx is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    data["users"][user_idx]["hashed_password"] = get_password_hash(setup_data.new_password)
    db.save(data)
    return {"message": "Password successfully created!"}

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db=Depends(get_database)):
    data = db.load()
    existing = next((u for u in data["users"] if u["email"] == user.email), None)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user.password)
    user_dict = user.model_dump(exclude={"password", "role"})
    
    assigned_role = "admin" if len(data["users"]) == 0 else user.role
    user_in_db = UserInDB(**user_dict, role=assigned_role, hashed_password=hashed_pwd)
    
    new_user = user_in_db.model_dump(exclude_none=True)
    new_user["_id"] = str(uuid4())
    data["users"].append(new_user)
    db.save(data)
    
    return new_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_database)):
    data = db.load()
    user = next((u for u in data["users"] if u["email"] == form_data.username), None)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    role = user.get("role", "viewer")
    
    # Strict Admin Security Check
    if role == "admin" and user["email"] != "rushikasrithamaddula2005@gmail.com":
        raise HTTPException(status_code=403, detail="Admin access restricted.")

    access_token = create_access_token(
        data={"sub": user["email"], "role": role}
    )
    return {"access_token": access_token, "token_type": "bearer"}
