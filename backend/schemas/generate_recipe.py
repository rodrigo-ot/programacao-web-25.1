from pydantic import BaseModel

class PromptInput(BaseModel):
    prompt: str

