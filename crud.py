from sqlalchemy.orm import Session
import models, schemas
from fastapi import HTTPException
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(username=user.username, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_favorite(db: Session, title: str, user_id: int):
    fav = models.Favorite(title=title, owner_id=user_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav

def get_favorites(db: Session, user_id: int):
    return db.query(models.Favorite).filter(models.Favorite.owner_id == user_id).all()

def delete_favorite(db: Session, user_id: int, title: str):
    fav = db.query(models.Favorite).filter(models.Favorite.owner_id == user_id, models.Favorite.title == title).first()
    if fav:
        db.delete(fav)
        db.commit()
    return get_favorites(db, user_id)

def update_favorite(db: Session, user_id: int, film_title: str, film_data: schemas.Film):
    favorite = db.query(models.Favorite).filter(
        models.Favorite.owner_id == user_id,
        models.Favorite.title == film_title
    ).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    favorite.title = film_data.title
    favorite.year = film_data.year
    favorite.genre = film_data.genre
    favorite.rating = film_data.rating
    favorite.description = film_data.description
    db.commit()
    db.refresh(favorite)
    return favorite
