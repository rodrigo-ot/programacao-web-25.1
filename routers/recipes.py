from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Recipe, Ingredient
from models import RecipeCreate, RecipeResponse
from security import get_current_user, get_db, require_role

router = APIRouter()

@router.get("/receitas", response_model=List[RecipeResponse])
def listar_receitas(db: Session = Depends(get_db)):
    return db.query(Recipe).all()

@router.post("/post-recipe", response_model=RecipeResponse, dependencies=[Depends(require_role("creator"))])
def criar_receita(receita: RecipeCreate, db: Session = Depends(get_db)):
    nova_receita = Recipe(
        title=receita.title,
        description=receita.description,
        image_url=receita.image_url
    )

    ingredientes = []
    for nome in receita.ingredients:
        ingrediente = db.query(Ingredient).filter(Ingredient.name == nome).first()
        if not ingrediente:
            ingrediente = Ingredient(name=nome)
            db.add(ingrediente)
            db.flush() 
        ingredientes.append(ingrediente)

    nova_receita.ingredients = ingredientes
    db.add(nova_receita)
    db.commit()
    db.refresh(nova_receita)
    return nova_receita

@router.delete("/receitas/{recipe_id}", status_code=204, dependencies=[Depends(require_role("creator"))])
def delete_receita(recipe_id: int, db: Session = Depends(get_db)):
    receita = db.query(Recipe).filter(Recipe.id == recipe_id).first()

    if not receita:
        raise HTTPException(status_code=404, detail="Receita não encontrada")

    db.delete(receita)
    db.commit()
    return {"message": "Receita excluída com sucesso"}


@router.put("/receitas/{recipe_id}", response_model=RecipeResponse, dependencies=[Depends(require_role("creator"))])
def editar_receita(recipe_id: int, receita: RecipeCreate, db: Session = Depends(get_db)):
    receita_existente = db.query(Recipe).filter(Recipe.id == recipe_id).first()

    if not receita_existente:
        raise HTTPException(status_code=404, detail="Receita não encontrada")

    receita_existente.title = receita.title
    receita_existente.description = receita.description
    receita_existente.image_url = receita.image_url

    ingredientes = []
    for nome in receita.ingredients:
        ingrediente = db.query(Ingredient).filter(Ingredient.name == nome).first()
        if not ingrediente:
            ingrediente = Ingredient(name=nome)
            db.add(ingrediente)
            db.flush() 
        ingredientes.append(ingrediente)

    receita_existente.ingredients = ingredientes

    db.commit()
    db.refresh(receita_existente)

    return receita_existente
