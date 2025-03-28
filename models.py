from typing import Optional
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from database import Base


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

class UserRegistration(BaseModel):
    username: str
    email: str
    password: str

class Receita(BaseModel):
    id: Optional[int] = None  # O id pode ser None, pois será atribuído pelo banco de dados
    title: str
    ingredients: str
    preparation: str
    time: int
    image_filename: Optional[str] = None

    class Config:
        from_attributes = True

class ReceitaDB(Base):
    __tablename__ = "receitas"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    ingredients = Column(String, nullable=False)
    preparation = Column(String, nullable=False)
    time = Column(Integer, nullable=False)
    image_filename = Column(String, nullable=True)
