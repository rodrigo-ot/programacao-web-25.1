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

class Receita(Base):
    __tablename__ = "receitas"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    ingredients = Column(String, nullable=False)
    preparation = Column(String, nullable=False)
    time = Column(Integer, nullable=False)
    image_filename = Column(String, nullable=True)