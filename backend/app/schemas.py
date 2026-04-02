from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime
from bson import ObjectId

# Support for MongoDB ObjectId in Pydantic
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated
PyObjectId = Annotated[str, BeforeValidator(str)]

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class PasswordReset(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class PasswordSetup(BaseModel):
    new_password: str

class RoleSelect(BaseModel):
    role: str

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "viewer" # viewer, analyst, admin

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    hashed_password: str
    is_active: bool = True

class UserResponse(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    is_active: bool

class RecordBase(BaseModel):
    amount: float
    type: str # 'income' or 'expense'
    category: str
    date: datetime
    notes: Optional[str] = None

class RecordCreate(RecordBase):
    pass

class RecordResponse(RecordBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

class Token(BaseModel):
    access_token: str
    token_type: str

class DashboardSummaryResponse(BaseModel):
    total_income: float
    total_expenses: float
    net_balance: float
    category_totals: Dict[str, float]
    recent_records: List[RecordResponse]
