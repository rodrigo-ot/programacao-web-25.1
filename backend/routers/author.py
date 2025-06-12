
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.recipes import  Recipe
from models.users import UserDB
from schemas.recipes import AuthorProfileResponse
from security import get_db 
router = APIRouter()

@router.get("/autores/{author_id}", response_model=AuthorProfileResponse)
def get_author_profile(author_id: int, db: Session = Depends(get_db)):

    author = db.query(UserDB).filter(UserDB.id == author_id).first() 
    if not author:
        raise HTTPException(status_code=404, detail="Autor não encontrado")

    recipes = db.query(Recipe).filter(Recipe.author_id == author_id).all()

    return {"id": author.id, "username": author.username, "recipes": recipes}

# gambiarra
@router.get("/autores/username/{username}", response_model=AuthorProfileResponse)
def get_author_profile_by_username(username: str, db: Session = Depends(get_db)):
    author = db.query(UserDB).filter(UserDB.username == username).first()
    if not author:
        raise HTTPException(status_code=404, detail="Autor não encontrado")

    recipes = db.query(Recipe).filter(Recipe.author_id == author.id).all()

    return {
        "id": author.id,
        "username": author.username,
        "recipes": recipes
    }