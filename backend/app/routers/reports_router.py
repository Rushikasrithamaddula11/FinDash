from fastapi import APIRouter, Depends
from typing import List
from ..db import get_database
from ..schemas import DashboardSummaryResponse
from ..dependencies import require_role

router = APIRouter()

@router.get("/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(db=Depends(get_database), current_user=Depends(require_role("viewer"))):
    data = db.load()
    records = data.get("records", [])
    
    total_income = sum(r["amount"] for r in records if r["type"] == "income")
    total_expenses = sum(r["amount"] for r in records if r["type"] == "expense")
    net_balance = total_income - total_expenses
    
    category_totals = {}
    for r in records:
        cat = r["category"]
        category_totals[cat] = category_totals.get(cat, 0) + r["amount"]
            
    recent = sorted(records, key=lambda x: x["date"], reverse=True)[:5]
        
    return DashboardSummaryResponse(
        total_income=total_income,
        total_expenses=total_expenses,
        net_balance=net_balance,
        category_totals=category_totals,
        recent_records=recent
    )
