from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from database import SessionLocal
from models.users import UserDB


SECRET_KEY = "15b00b55306c9c044c11e1dac989087ca0d931a4632a3e251947042da4ac2812"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_username(db: Session, username: str):
    return db.query(UserDB).filter(UserDB.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({
        "exp": expire,
        "sub": data.get("sub"), 
        "role": data.get("role") 
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(UserDB).filter(UserDB.username == username).first()
    if user is None or user.disabled:
        raise credentials_exception

    user.role = role
    return user

def require_role(role: str):
    def role_checker(user = Depends(get_current_user)):
        if user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso não autorizado"
            )
        return user
    return role_checker


def create_password_reset_token(email: str, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = {"sub": email, "exp": datetime.utcnow() + expires_delta}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

