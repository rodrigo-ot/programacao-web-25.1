from fastapi import APIRouter, HTTPException, Depends
from security import get_password_hash, authenticate_user, create_access_token, get_current_active_user, fake_users_db
from models import UserRegistration, Token
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

auth_router = APIRouter()

@auth_router.post("/register")
def register_user(user: UserRegistration):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    if any(u['email'] == user.email for u in fake_users_db.values()):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    fake_users_db[user.username] = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password,
        "disabled": False,
    }
    return {"message": "User registered successfully"}



@auth_router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer"}
