from fastapi import Depends, APIRouter, status, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from database import get_db
import models
from typing import Annotated
from schemas import TeamCreate, TeamBase, TeamResponse

router = APIRouter()

@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(team: TeamCreate, db: Annotated[Session, Depends(get_db)]):
    league = db.execute(select(models.League).where(models.League.id == team.league_id)).scalar_one_or_none()
    if not league:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="League not found")
    if len(league.teams) == 5:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="League already has 5 teams")
    draft_position = len(league.teams) + 1
    statement = select(models.Team).where(models.Team.name == team.name)
    existing_team = db.execute(statement).scalar_one_or_none()
    if existing_team:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team with this name already exists")
    new_team = models.Team(
        name=team.name,
        password=team.password,
        league_id=team.league_id,
        draft_position=draft_position
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team

@router.get("/{name}", response_model=TeamResponse)
def get_team(name: str, db: Annotated[Session, Depends(get_db)]):
    team = db.execute(select(models.Team).where(models.Team.name == name).options(selectinload(models.Team.players), selectinload(models.Team.home_matchups), selectinload(models.Team.away_matchups))).scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    return team