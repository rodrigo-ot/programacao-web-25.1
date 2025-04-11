from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from models import UserRegistration, Token, User
from models import UserDB
from security import (
    get_current_user, get_password_hash, authenticate_user,
    create_access_token, get_db, require_role
)

auth_router = APIRouter()

@auth_router.post("/register")
def register_user(user: UserRegistration, db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    if db.query(UserDB).filter(UserDB.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    db_user = UserDB(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        disabled=False,
        role=user.role 
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message": "User registered successfully"}

@auth_router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer"}

# @auth_router.get("/create-recipe")
# def create_recipe(user: User = Depends(get_current_active_user)):
#     if user.role != "creator":
#         raise HTTPException(status_code=403, detail="Você não tem permissão para acessar esta rota.")

# @auth_router.get("/create-recipe")
# def create_recipe(
#     user: UserDB = Depends(require_role("creator")),
#     db: Session = Depends(get_db)
# ):
#     # Only users with the "creator" role can access this route
#     return {"message": "Recipe created successfully"}