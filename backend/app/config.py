import os
import secrets


def get_jwt_key() -> str:
    """Return the JWT signing key from environment or generate a random one."""
    return os.environ.get("JWT_SECRET_KEY") or secrets.token_urlsafe(32)


JWT_KEY = get_jwt_key()
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60
