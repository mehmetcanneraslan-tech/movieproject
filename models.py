from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

    favorites = relationship("Favorite", back_populates="owner")

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    year = Column(Integer, default=0)
    genre = Column(String, default="")
    rating = Column(Integer, default=0)
    description = Column(String, default="")
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="favorites")
