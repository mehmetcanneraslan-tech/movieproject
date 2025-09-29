from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, Base, get_db
from auth import create_token, get_current_user

app = FastAPI()

Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register
@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    return crud.create_user(db, user)

# Login
from fastapi import Body


from fastapi.security import OAuth2PasswordRequestForm

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, form_data.username)
    if not db_user or db_user.password != form_data.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}


# Add favorite
@app.post("/favorites", response_model=schemas.FavoriteOut)
def add_favorite(film: schemas.Film, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_favorite(db, film.title, current_user.id)

# List favorites
@app.get("/favorites", response_model=list[schemas.FavoriteOut])
def list_favorites(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_favorites(db, current_user.id)

# Delete favorite
@app.delete("/favorites/{film_title}", response_model=list[schemas.FavoriteOut])
def delete_favorite(film_title: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.delete_favorite(db, current_user.id, film_title)

# Update favorite
@app.put("/favorites/{film_title}", response_model=schemas.FavoriteOut)
def update_favorite(film_title: str, film: schemas.Film, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.update_favorite(db, current_user.id, film_title, film)
