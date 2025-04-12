from fastapi import FastAPI, Request, Depends, HTTPException, Form, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from routers.auth_routes import auth_router
from security import get_current_user, require_role
from models import User, UserDB, RecipeResponse, RecipeDB
from pydantic import BaseModel
from typing import List, Annotated, Optional
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ou especifique sua origem, tipo http://127.0.0.1:5500
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  # Isso é ESSENCIAL para aceitar o Authorization
)

from models import Base
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.include_router(auth_router)

@app.get("/users/me/", response_class=HTMLResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    return {"username": current_user.username}

@app.get("/auth", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("authentication.html", {"request": request})

@app.get("/home", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})


@app.get("/users", response_model=List[User])

async def list_users(db: db_dependency):
    return db.query(UserDB).all()


@app.get("/post-recipe", response_class=HTMLResponse, dependencies=[Depends(require_role("creator"))])
def show_recipe_form(request: Request):
    return templates.TemplateResponse("post_recipe.html", {"request": request})



@app.get("/admin-page", response_class=HTMLResponse, dependencies=[Depends(require_role("creator"))])
def admin_page(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})


@app.post("/recipes/", response_model=RecipeResponse)
async def create_recipe(
        db: db_dependency,
        title: str = Form(...),
        ingredients: str = Form(...),
        preparation: str = Form(...),
        time: int = Form(...),
        image: UploadFile = File(None),
        current_user = Depends(get_current_user),  # Garantir que é um criador
):
    # Verifica se o usuário tem o papel de criador
    if current_user.role != "creator":
        raise HTTPException(status_code=403, detail="Você precisa ser um criador para adicionar receitas")

    image_filename = None
    if image:
        image_filename = f"static/imgs/{image.filename}"
        with open(image_filename, "wb") as buffer:
            buffer.write(await image.read())

    # Criação da nova receita
    new_recipe = RecipeDB(
        title=title,
        ingredients=ingredients,
        preparation=preparation,
        time=time,
        image_filename=image_filename,
        creator_id=current_user.id,  # Associando a receita ao criador
    )

    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)

    return new_recipe

@app.get("/recipes/", response_model=List[RecipeResponse])
async def list_recipes(db: db_dependency):
    return db.query(RecipeDB).filter(RecipeDB.is_visible == True).all()  # Apenas as visíveis

@app.get("/recipes/{recipe_id}", response_model=RecipeResponse)
async def view_recipe(recipe_id: int, db: db_dependency):
    recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()

    if not recipe or not recipe.is_visible:
        raise HTTPException(status_code=404, detail="Receita não encontrada ou não visível")

    return recipe

@app.put("/recipes/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
        db: db_dependency,
        recipe_id: int,
        title: Optional[str] = None,
        ingredients: Optional[str] = None,
        preparation: Optional[str] = None,
        time: Optional[int] = None,
        image: Optional[UploadFile] = None,
        is_visible: Optional[bool] = None,
        current_user = Depends(get_current_user),
):
    recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()

    if not recipe:
        raise HTTPException(status_code=404, detail="Receita não encontrada")

    if recipe.creator_id != current_user.id:  # Garantir que o criador seja o próprio usuário
        raise HTTPException(status_code=403, detail="Você não tem permissão para editar esta receita")

    if title:
        recipe.title = title
    if ingredients:
        recipe.ingredients = ingredients
    if preparation:
        recipe.preparation = preparation
    if time:
        recipe.time = time
    if image:
        image_filename = f"static/imgs/{image.filename}"
        with open(image_filename, "wb") as buffer:
            buffer.write(await image.read())
        recipe.image_filename = image_filename
    if is_visible is not None:
        recipe.is_visible = is_visible

    db.commit()
    db.refresh(recipe)

    return recipe


