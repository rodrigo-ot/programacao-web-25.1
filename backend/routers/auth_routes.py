from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
import jwt
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import timedelta

from models.users import UserDB
from schemas.reset_password import PasswordReset, ResetPasswordRequest
from schemas.users import Token, UserRegistration
from security import (
    ALGORITHM, SECRET_KEY, create_password_reset_token, get_current_user, get_password_hash, authenticate_user,
    create_access_token, get_db, require_role
)
from fastapi.responses import HTMLResponse

import jwt
import resend

from dotenv import load_dotenv
import os

load_dotenv()


auth_router = APIRouter()
router = APIRouter()
resend_api_key = os.getenv("RESEND_API_KEY")

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

@router.get("/me")
def get_user_info(user = Depends(get_current_user)):
    return {
        "username": user.username,
        "role": user.role
    }

@auth_router.post("/forgot-password")
def forgot_password(request: PasswordReset, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email não encontrado")

    reset_token = create_password_reset_token(user.email)
    reset_link = f"http://localhost:8001/reset-password?token={reset_token}"

    try:
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": request.email,
            "subject": "Recuperação de Senha",
            "html": f"""
                <p>Olá, {user.username}!</p>
                <p>Você solicitou a redefinição de senha. Clique no link abaixo:</p>
                <a href="{reset_link}">Redefinir Senha</a>
                <p>Se não foi você, ignore este e-mail.</p>
            """
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao enviar e-mail: {str(e)}")

    return {"message": "Link de recuperação enviado para o e-mail fornecido"}

@auth_router.get("/reset-password", response_class=HTMLResponse)
def reset_password_page(token: str):
    with open("templates/reset_password.html", "r", encoding="utf-8") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content)

@auth_router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=400, detail="Token expirado ou inválido")


    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    user.hashed_password = get_password_hash(data.new_password)
    db.commit()

    return {"message": "Senha redefinida com sucesso"}