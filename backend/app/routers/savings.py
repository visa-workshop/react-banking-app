from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import SavingsCurrency
from ..schemas import SavingsCurrencyOut

router = APIRouter(prefix="/api/savings", tags=["savings"])


@router.get("/currencies", response_model=list[SavingsCurrencyOut])
def get_savings_currencies(db: Session = Depends(get_db)):
    return db.query(SavingsCurrency).all()
