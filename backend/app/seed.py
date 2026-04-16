from sqlalchemy.orm import Session

from .auth import get_password_hash
from .models import Card, Recipient, SavingsCurrency, Transaction, User


def seed_data(db: Session) -> None:
    """Seed the database with default data if empty."""
    if db.query(User).first() is not None:
        return

    user = User(
        email="cenk@bank.com",
        password_hash=get_password_hash("password123"),
        full_name="Cenk SARI",
        username="cenksari",
        profile_image="images/profile.jpg",
        balance=1325.50,
        currency="EURO",
        currency_symbol="€",
    )
    db.add(user)
    db.flush()

    transactions_data = [
        {"icon": "coffee", "time": "15:34", "name": "Coffee", "amount": 3.25, "color": "purple"},
        {"icon": "hotel", "time": "12:21", "name": "Hotel booking", "amount": 323.26, "color": "yellow"},
        {"icon": "sync", "time": "11:46", "name": "Subscription payment", "amount": 9.99, "color": "orange"},
        {"icon": "water", "time": "10:51", "name": "Water bill", "amount": 54.21, "color": "gray"},
        {"icon": "water", "time": "09:14", "name": "Supermarket", "amount": 78.12, "color": "red"},
        {"icon": "local_activity", "time": "09:14", "name": "Tickets", "amount": 78.12, "color": "blue"},
        {"icon": "bolt", "time": "07:33", "name": "Electricty bill", "amount": 43.55, "color": "green"},
    ]

    for date in ["May 6", "May 5"]:
        for t in transactions_data:
            db.add(
                Transaction(
                    user_id=user.id,
                    icon=t["icon"],
                    name=t["name"],
                    time=t["time"],
                    amount=t["amount"],
                    color=t["color"],
                    currency_symbol="€",
                    date=date,
                )
            )

    db.add(
        Card(
            user_id=user.id,
            number="5244 2150 8252 ****",
            cvc_number="824",
            valid_until="10 / 30",
            card_holder="CENK SARI",
            balance=783.45,
            card_limit=1250.00,
        )
    )

    recipients_data = [
        {"name": "Sarah Johnson", "initials": "SJ", "color": "blue", "account_info": "IBAN ...4521"},
        {"name": "Mike Peters", "initials": "MP", "color": "purple", "account_info": "IBAN ...8834"},
        {"name": "Emma Wilson", "initials": "EW", "color": "red", "account_info": "IBAN ...2290"},
        {"name": "James Brown", "initials": "JB", "color": "green", "account_info": "IBAN ...6617"},
        {"name": "Lisa Chen", "initials": "LC", "color": "orange", "account_info": "IBAN ...3345"},
    ]

    for r in recipients_data:
        db.add(
            Recipient(
                user_id=user.id,
                name=r["name"],
                initials=r["initials"],
                color=r["color"],
                account_info=r["account_info"],
            )
        )

    savings_data = [
        {"name": "British Pound", "short_name": "GBP", "aer": "2.29% AER"},
        {"name": "US Dollar", "short_name": "USD", "aer": "1.49% AER"},
        {"name": "Euro", "short_name": "EUR", "aer": "1.19% AER"},
    ]

    for s in savings_data:
        db.add(
            SavingsCurrency(
                name=s["name"],
                short_name=s["short_name"],
                aer=s["aer"],
                svg_icon="",
            )
        )

    db.commit()
