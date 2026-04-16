from fastapi import APIRouter, Depends

from ..auth import get_current_user
from ..models import User
from ..schemas import TransferRequest, TransferResponse

router = APIRouter(prefix="/api/transfers", tags=["transfers"])


@router.post("", response_model=TransferResponse)
def create_transfer(
    request: TransferRequest,
    current_user: User = Depends(get_current_user),
):
    return TransferResponse(success=True, message="Transfer completed")
