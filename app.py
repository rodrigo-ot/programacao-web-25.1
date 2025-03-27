import os
from sqlalchemy.orm import Session
from database import get_db
from models import Receita
from typing import List
from fastapi import FastAPI, Request, Depends, Form, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from routers.auth_routes import auth_router
from security import get_current_active_user
from security import fake_users_db
from models import User


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.include_router(auth_router)

@app.get("/users/me/", response_class=HTMLResponse)
async def read_users_me(current_user = Depends(get_current_active_user)):
    return {"username": current_user.username}

@app.get("/login", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/home", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/register-page", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse("register-page.html", {"request": request})

@app.get("/users", response_model=List[User])
async def get_users():
    return list(fake_users_db.values())

@app.post("/receitas/")
async def criar_receita(
    title: str = Form(...),
    ingredients: str = Form(...),
    preparation: str = Form(...),
    time: int = Form(...),
    image: Optional[UploadFile] = File(None)
):
    receita = {
        "title": title,
        "ingredients": ingredients,
        "preparation": preparation,
        "time": time,
        "image_filename": image.filename if image else None
    }
    return {"message": "Receita recebida para moderação!", "receita": receita}

UPLOAD_DIR = "static/imgs/imgs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/receitas/")
async def criar_receita(
    title: str = Form(...),
    ingredients: str = Form(...),
    preparation: str = Form(...),
    time: int = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_filename = None
    if image:
        image_filename = f"{UPLOAD_DIR}/{image.filename}"
        with open(image_filename, "wb") as buffer:
            buffer.write(await image.read())

    nova_receita = Receita(
        title=title,
        ingredients=ingredients,
        preparation=preparation,
        time=time,
        image_filename=image_filename
    )

    db.add(nova_receita)
    db.commit()
    db.refresh(nova_receita)

    return {"message": "Receita cadastrada!", "receita": nova_receita}

@app.get("/receitas/", response_model=List[Receita])
async def listar_receitas(db: Session = Depends(get_db)):
    return db.query(Receita).all()