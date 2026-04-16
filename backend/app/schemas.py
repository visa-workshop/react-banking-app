from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserProfile(BaseModel):
    full_name: str
    username: str
    email: str
    profile_image: str

    class Config:
        from_attributes = True


class UserBalance(BaseModel):
    balance: float
    currency: str
    currency_symbol: str

    class Config:
        from_attributes = True


class TransactionOut(BaseModel):
    id: int
    icon: str
    name: str
    time: str
    amount: float
    color: str
    currency_symbol: str
    date: str

    class Config:
        from_attributes = True


class CardOut(BaseModel):
    id: int
    number: str
    cvc_number: str
    valid_until: str
    card_holder: str
    balance: float
    card_limit: float

    class Config:
        from_attributes = True


class RecipientOut(BaseModel):
    id: int
    name: str
    initials: str
    color: str
    account_info: str

    class Config:
        from_attributes = True


class TransferRequest(BaseModel):
    recipient_id: int
    amount: float


class TransferResponse(BaseModel):
    success: bool
    message: str


class SavingsCurrencyOut(BaseModel):
    id: int
    name: str
    short_name: str
    aer: str
    svg_icon: str

    class Config:
        from_attributes = True
