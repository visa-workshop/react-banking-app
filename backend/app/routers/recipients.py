from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Recipient, User
from ..schemas import RecipientOut

router = APIRouter(prefix="/api/recipients", tags=["recipients"])


@router.get("", response_model=list[RecipientOut])
def get_recipients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Recipient).filter(Recipient.user_id == current_user.id).all()
