from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from routers.auth_routes import auth_router
from security import get_current_user, require_role
from models import User, UserDB 
from pydantic import BaseModel
from typing import List, Annotated
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from datetime import datetime

app = FastAPI()

from models import Base
Base.metadata.create_all(bind=engine)

# # Schemas Pydantic
# class RecipeBase(BaseModel):
#     title: str
#     description: str

# class RecipeCreate(RecipeBase):
#     post_time: datetime = datetime.now()

# class RecipeResponse(RecipeBase):
#     id: int
#     post_time: datetime
#     class Config:
#         orm_mode = True


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

# @app.get("/register-page", response_class=HTMLResponse)
# async def read_register_page(request: Request):
#     return templates.TemplateResponse("register-page.html", {"request": request})

@app.get("/users", response_model=List[User])
async def list_users(db: db_dependency):
    return db.query(UserDB).all()

# @app.post("/recipes/", response_model=RecipeResponse)
# async def create_recipe(recipe: RecipeCreate, db: db_dependency):
#     db_recipe = Recipe(
#         title=recipe.title,
#         description=recipe.description,
#         post_time=recipe.post_time
#     )
#     db.add(db_recipe)
#     db.commit()
#     db.refresh(db_recipe)
#     return db_recipe

@app.get("/create-recipe", dependencies=[Depends(require_role("creator"))])
def create_recipe(
    #
    #
):
    return {"message": f"Recipe created"}


@app.get("/admin-page", response_class=HTMLResponse, dependencies=[Depends(require_role("creator"))])
def admin_page(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})