from sqlalchemy import Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    username = Column(String, nullable=False)
    profile_image = Column(String, default="images/profile.jpg")
    balance = Column(Float, default=1325.50)
    currency = Column(String, default="EURO")
    currency_symbol = Column(String, default="€")

    transactions = relationship("Transaction", back_populates="user")
    cards = relationship("Card", back_populates="user")
    recipients = relationship("Recipient", back_populates="user")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    icon = Column(String, nullable=False)
    name = Column(String, nullable=False)
    time = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    color = Column(String, nullable=False)
    currency_symbol = Column(String, default="€")
    date = Column(String, nullable=False)

    user = relationship("User", back_populates="transactions")


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    number = Column(String, nullable=False)
    cvc_number = Column(String, nullable=False)
    valid_until = Column(String, nullable=False)
    card_holder = Column(String, nullable=False)
    balance = Column(Float, nullable=False)
    card_limit = Column(Float, nullable=False)

    user = relationship("User", back_populates="cards")


class Recipient(Base):
    __tablename__ = "recipients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    initials = Column(String, nullable=False)
    color = Column(String, nullable=False)
    account_info = Column(String, nullable=False)

    user = relationship("User", back_populates="recipients")


class SavingsCurrency(Base):
    __tablename__ = "savings_currencies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    short_name = Column(String, nullable=False)
    aer = Column(String, nullable=False)
    svg_icon = Column(Text, default="")
