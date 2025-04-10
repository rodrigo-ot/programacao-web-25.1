from pydantic import BaseModel
from sqlalchemy import Boolean, Column, Integer, String, DateTime
from datetime import datetime
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
    role: str 


# class Recipe(Base):
#     __tablename__ = "recipes"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     description = Column(String)
#     post_time = Column(DateTime, default=datetime.utcnow)

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    disabled = Column(Boolean, default=False)
    role = Column(String, default="client")