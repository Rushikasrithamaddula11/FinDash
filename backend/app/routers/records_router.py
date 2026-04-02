from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import uuid4
from datetime import datetime
from ..db import get_database
from ..schemas import RecordCreate, RecordResponse
from ..dependencies import require_role

router = APIRouter()

@router.post("/", response_model=RecordResponse)
async def create_record(record: RecordCreate, db=Depends(get_database), current_user=Depends(require_role("admin"))):
    data = db.load()
    record_dict = record.model_dump()
    record_dict["_id"] = str(uuid4())
    record_dict["date"] = record_dict["date"].isoformat() if isinstance(record_dict["date"], datetime) else record_dict["date"]
    data["records"].append(record_dict)
    db.save(data)
    return record_dict

@router.get("/", response_model=List[RecordResponse])
async def get_records(db=Depends(get_database), current_user=Depends(require_role("analyst"))):
    data = db.load()
    return sorted(data["records"], key=lambda x: x["date"], reverse=True)

@router.put("/{record_id}", response_model=RecordResponse)
async def update_record(record_id: str, record_in: RecordCreate, db=Depends(get_database), current_user=Depends(require_role("admin"))):
    data = db.load()
    for i, rec in enumerate(data["records"]):
        if rec["_id"] == record_id:
            update_data = record_in.model_dump()
            update_data["_id"] = record_id
            if isinstance(update_data["date"], datetime):
                update_data["date"] = update_data["date"].isoformat()
            data["records"][i] = update_data
            db.save(data)
            return update_data
    raise HTTPException(status_code=404, detail="Record not found")

@router.delete("/{record_id}")
async def delete_record(record_id: str, db=Depends(get_database), current_user=Depends(require_role("admin"))):
    data = db.load()
    new_records = [r for r in data["records"] if r["_id"] != record_id]
    if len(new_records) == len(data["records"]):
        raise HTTPException(status_code=404, detail="Record not found")
    data["records"] = new_records
    db.save(data)
    return {"message": "Record deleted successfully"}
