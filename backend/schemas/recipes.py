from typing import List, Optional
from pydantic import BaseModel

class AuthorResponse(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

class IngredientBase(BaseModel):
    name: str

class IngredientResponse(IngredientBase):
    id: int
    class Config:
        orm_mode = True

class RecipeCreate(BaseModel):
    title: str
    description: str
    ingredients: List[str]  
    image_url: Optional[str] = None

class RecipeResponse(BaseModel):
    id: int
    title: str
    description: str
    image_url: Optional[str]
    ingredients: List[IngredientResponse]
    author: Optional[AuthorResponse] = None

    class Config:
        orm_mode = True

class SimpleRecipeResponse(BaseModel):
    id: int
    title: str
    image_url: Optional[str]

    class Config:
        orm_mode = True
        
class AuthorProfileResponse(BaseModel):
    id: int
    username: str
    recipes: List[SimpleRecipeResponse] = []

    class Config:
        orm_mode = True