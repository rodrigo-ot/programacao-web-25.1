import os
from fastapi import APIRouter, HTTPException
from schemas.generate_recipe import PromptInput
import google.generativeai as genai

router = APIRouter()

try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except AttributeError as e:
    print("Erro: A chave da API do Google não foi encontrada. Verifique seu arquivo .env.")

@router.post("/generate")
async def generate_text(data: PromptInput):
    """
    Recebe ingredientes do usuário e retorna uma sugestão de receita.
    """
    system_instruction = (
        "Você é um assistente de culinária. Sua tarefa é criar uma receita simples e "
        "usando os seguintes ingredientes. Forneça o nome da receita, "
        "uma lista de ingredientes e um modo de preparo claro e conciso.\n\n"
        "Ingredientes fornecidos: "
    )

    full_prompt = f"{system_instruction}{data.prompt}"

    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(full_prompt)
        return {"response": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
