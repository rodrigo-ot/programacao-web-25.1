from typing import List, Optional
from pydantic import BaseModel


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

    class Config:
        orm_mode = True