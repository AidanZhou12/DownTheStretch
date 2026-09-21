from fastapi import Depends, APIRouter, status, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from database import get_db
from typing import Annotated
from schemas import LeagueCreate, LeagueBase, LeagueResponse
import models

router = APIRouter()

@router.post("", response_model=LeagueResponse, status_code=status.HTTP_201_CREATED)
def create_league(league: LeagueCreate, db: Annotated[Session, Depends(get_db)]):
    statement = select(models.League).where(models.League.name == league.name)
    existing_league = db.execute(statement).scalar_one_or_none()
    if existing_league:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="League with this name already exists")
    new_league = models.League(name=league.name)
    new_draft = models.Draft(league=new_league)
    db.add(new_league)
    db.add(new_draft)
    db.commit()
    db.refresh(new_league)
    return new_league

@router.get("", response_model=list[LeagueResponse])
def get_leagues(db: Annotated[Session, Depends(get_db)]):
    leagues = db.execute(select(models.League)).scalars().all()
    return leagues

@router.get("/{name}", response_model=LeagueResponse)
def get_league(name: str, db: Annotated[Session, Depends(get_db)]):
    league = db.execute(select(models.League).where(models.League.name == name).options(selectinload(models.League.teams), selectinload(models.League.draft))).scalar_one_or_none()
    if not league:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="League not found")
    return league

@router.get("/id/{id}", response_model=LeagueResponse)
def get_league_by_id(id: int, db: Annotated[Session, Depends(get_db)]):
    league = db.execute(select(models.League).where(models.League.id == id).options(selectinload(models.League.teams), selectinload(models.League.draft))).scalar_one_or_none()
    if not league:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="League not found")
    return league