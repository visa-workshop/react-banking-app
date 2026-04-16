from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Card, User
from ..schemas import CardOut

router = APIRouter(prefix="/api/cards", tags=["cards"])


@router.get("", response_model=list[CardOut])
def get_cards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Card).filter(Card.user_id == current_user.id).all()
