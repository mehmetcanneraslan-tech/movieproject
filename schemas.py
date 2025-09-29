from pydantic import BaseModel

# Kullanıcı
class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Film
class Film(BaseModel):
    title: str
    year: int
    genre: str
    rating: int
    description: str

# Favorite
class FavoriteOut(BaseModel):
    id: int
    title: str
    year: int
    genre: str
    rating: int
    description: str
    owner_id: int  # <- Bu alan burada olmalı, response için

    class Config:
        orm_mode = True