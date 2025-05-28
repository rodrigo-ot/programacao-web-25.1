
from pydantic import BaseModel


class ComentarioCreate(BaseModel):
    text: str
    star: int | None = None  

class ComentarioResponse(BaseModel):
    id: int
    text: str
    star: int | None = None
    author_id: int
    recipe_id: int
    username: str  

    class Config:
        orm_mode = True