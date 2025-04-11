from fastapi.testclient import TestClient
from app import app  
from models import UserRegistration, Token
from security import fake_users_db, get_password_hash 

client = TestClient(app)

def test_register_user_success():
    # Dados de teste para o registro
    user_data = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "password123"
    }

    response = client.post("/register", json=user_data)
    
    assert response.status_code == 200
    assert response.json() == {"message": "Cadastrado realizado com sucesso, faça Login!"}

    # Verifica se o usuário foi adicionado ao banco de dados falso
    assert "newuser" in fake_users_db

def test_register_user_username_already_exists():
    # Dados de teste para o registro com username já existente
    user_data = {
        "username": "newuser",
        "email": "newuser2@example.com",
        "password": "password123"
    }

    # Criando um usuário com o nome de usuário já existente
    fake_users_db["newuser"] = {
        "username": "newuser",
        "email": "newuser@example.com",
        "hashed_password": get_password_hash("password123"),
        "disabled": False,
    }

    response = client.post("/register", json=user_data)

    assert response.status_code == 400
    assert response.json() == {"message": "Username already registered"}

def test_register_user_email_already_exists():
    # Dados de teste para o registro com e-mail já existente
    user_data = {
        "username": "newuser2",
        "email": "newuser@example.com",
        "password": "password123"
    }

    # Criando um usuário com o e-mail já existente
    fake_users_db["newuser"] = {
        "username": "newuser",
        "email": "newuser@example.com",
        "hashed_password": get_password_hash("password123"),
        "disabled": False,
    }

    response = client.post("/register", json=user_data)

    assert response.status_code == 400
    assert response.json() == {"message": "Email already registered"}

def test_login_for_access_token_success():
    # Dados do usuário para login
    user_data = {
        "username": "newuser",
        "password": "password123"
    }

    # Registrando o usuário antes de tentar o login
    hashed_password = get_password_hash(user_data["password"])  # Gera o hash válido para a senha
    fake_users_db["newuser"] = {
        "username": "newuser",
        "email": "newuser@example.com",
        "hashed_password": hashed_password,  # Usando o hash real
        "disabled": False,
    }

    response = client.post("/token", data=user_data)

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_for_access_token_invalid_credentials():
    # Dados do usuário para login com credenciais incorretas
    user_data = {
        "username": "wronguser",
        "password": "wrongpassword"
    }

    response = client.post("/token", data=user_data)

    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}
