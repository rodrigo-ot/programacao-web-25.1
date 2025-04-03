from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from security import get_current_active_user, get_password_hash, authenticate_user, create_access_token, fake_users_db
from models import User, UserRegistration, Token
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

auth_router = APIRouter()

@auth_router.post("/register")
def register_user(user: UserRegistration):
    if user.username in fake_users_db:
        return JSONResponse(
            status_code=400,
            content={"message": "Username already registered"}
        )
    if any(u['email'] == user.email for u in fake_users_db.values()):
        return JSONResponse(
            status_code=400,
            content={"message": "Email already registered"}
        )
    
    hashed_password = get_password_hash(user.password)
    fake_users_db[user.username] = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password,
        "disabled": False,
        "role": user.role
    }
    
    return {"message": "Cadastrado realizado com sucesso, faça Login!"}



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


@auth_router.post("/create-recipe")
def create_recipe(user: User = Depends(get_current_active_user)):
    if user.role != "creator":
        raise HTTPException(status_code=403, detail="Você não tem permissão para acessar esta rota.")
    
