from fastapi import APIRouter, Depends

from ..auth import get_current_user
from ..models import User
from ..schemas import UserBalance, UserProfile

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/profile", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    return UserProfile(
        full_name=current_user.full_name,
        username=current_user.username,
        email=current_user.email,
        profile_image=current_user.profile_image,
    )


@router.get("/balance", response_model=UserBalance)
def get_balance(current_user: User = Depends(get_current_user)):
    return UserBalance(
        balance=current_user.balance,
        currency=current_user.currency,
        currency_symbol=current_user.currency_symbol,
    )
