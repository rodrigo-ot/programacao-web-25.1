from sqlalchemy import  Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Comentario(Base):
    __tablename__ = "comentarios"
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(String, nullable=False)
    star = Column(Integer, nullable=True)  
    

    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    recipe = relationship("Recipe", back_populates="comentarios")
    author = relationship("UserDB", back_populates="comentarios")