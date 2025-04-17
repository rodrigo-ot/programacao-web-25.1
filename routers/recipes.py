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

    # Processar ingredientes
    ingredientes = []
    for nome in receita.ingredients:
        ingrediente = db.query(Ingredient).filter(Ingredient.name == nome).first()
        if not ingrediente:
            ingrediente = Ingredient(name=nome)
            db.add(ingrediente)
            db.flush()  # para obter o ID antes do commit
        ingredientes.append(ingrediente)

    nova_receita.ingredients = ingredientes
    db.add(nova_receita)
    db.commit()
    db.refresh(nova_receita)
    return nova_receita

@router.delete("/receitas/{recipe_id}", status_code=204)
def delete_receita(recipe_id: int, db: Session = Depends(get_db)):
    # Procurar pela receita com o ID fornecido
    receita = db.query(Recipe).filter(Recipe.id == recipe_id).first()

    # Se a receita não for encontrada, lançar uma exceção
    if not receita:
        raise HTTPException(status_code=404, detail="Receita não encontrada")

    # Deletar a receita
    db.delete(receita)
    db.commit()
    return {"message": "Receita excluída com sucesso"}
