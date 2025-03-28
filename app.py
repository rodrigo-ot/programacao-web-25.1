from typing import List
from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from routers.auth_routes import auth_router
from security import get_current_active_user
from security import fake_users_db
from models import User
from fastapi.staticfiles import StaticFiles

app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

app.include_router(auth_router)

@app.get("/users/me/", response_class=HTMLResponse)
async def read_users_me(current_user = Depends(get_current_active_user)):
    return {"username": current_user.username}

@app.get("/auth", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("authentication.html", {"request": request})

@app.get("/home", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/register-page", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse("register-page.html", {"request": request})

@app.get("/users", response_model=List[User])
async def get_users():
    return list(fake_users_db.values())