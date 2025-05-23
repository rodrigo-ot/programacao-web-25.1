from typing import List, Optional
from pydantic import BaseModel, EmailStr
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Table, Text
from datetime import datetime
from sqlalchemy.orm import relationship
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

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    image_url = Column(String, nullable=True)

    ingredients = relationship("Ingredient", secondary="recipe_ingredients", backref="recipes")
    comentarios = relationship("Comentario", back_populates="recipe", cascade="all, delete-orphan")

class Comentario(Base):
    __tablename__ = "comentarios"
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(String, nullable=False)
    star = Column(Integer, nullable=True)  
    

    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    recipe = relationship("Recipe", back_populates="comentarios")
    author = relationship("UserDB")

recipe_ingredients = Table(
    "recipe_ingredients",
    Base.metadata,
    Column("recipe_id", ForeignKey("recipes.id"), primary_key=True),
    Column("ingredient_id", ForeignKey("ingredients.id"), primary_key=True)
)

class IngredientBase(BaseModel):
    name: str

class IngredientResponse(IngredientBase):
    id: int
    class Config:
        orm_mode = True

class RecipeCreate(BaseModel):
    title: str
    description: str
    ingredients: List[str]  # apenas os nomes
    image_url: Optional[str] = None

class RecipeResponse(BaseModel):
    id: int
    title: str
    description: str
    image_url: Optional[str]
    ingredients: List[IngredientResponse]

    class Config:
        orm_mode = True

class PasswordReset(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ComentarioCreate(BaseModel):
    text: str
    star: int | None = None  

class ComentarioResponse(BaseModel):
    id: int
    text: str
    star: int | None = None
    author_id: int
    recipe_id: int



