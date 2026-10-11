from fastapi import Depends, APIRouter, status, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from database import get_db
import models
from typing import Annotated
from schemas import TeamCreate, TeamBase, TeamResponse, MatchupResponse

router = APIRouter()

@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(team: TeamCreate, db: Annotated[Session, Depends(get_db)]):
    league = db.execute(select(models.League).where(models.League.id == team.league_id)).scalar_one_or_none()
    if not league:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="League not found")
    if len(league.teams) >= 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="League already has 6 teams")
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

@router.get("/id/{team_id}", response_model=TeamResponse)
def get_team_by_id(team_id: int, db: Annotated[Session, Depends(get_db)]):
    team = db.execute(select(models.Team).where(models.Team.id == team_id).options(selectinload(models.Team.players), selectinload(models.Team.home_matchups), selectinload(models.Team.away_matchups))).scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    return team

@router.get("/{name}/matchup", response_model=MatchupResponse)
def get_current_matchup(name: str, db: Annotated[Session, Depends(get_db)]):
    team = db.execute(select(models.Team).where(models.Team.name == name).options(selectinload(models.Team.league))).scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    current_week = team.league.current_week
    matchup = db.execute(select(models.Matchup).where(
        ((models.Matchup.home_team_id == team.id) | (models.Matchup.away_team_id == team.id)) &
        (models.Matchup.week == current_week)
    )).scalar_one_or_none()
    if not matchup:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Matchup not found for the current week")
    return matchup

@router.patch("/{team_id}/swap", response_model=TeamResponse)
def swap_players(team_id: int, player1_id: int, player2_id: int, db: Annotated[Session, Depends(get_db)]):
    team = db.execute(select(models.Team).where(models.Team.id == team_id).options(selectinload(models.Team.players))).scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    player1 = db.execute(select(models.Player).where(models.Player.id == player1_id)).scalar_one_or_none()
    player2 = db.execute(select(models.Player).where(models.Player.id == player2_id)).scalar_one_or_none()
    if not player1 or not player2:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or both players not found")
    if player1 not in team.players:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Player to drop is not on the team")
    if player2 in team.players:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Player to add is already on the team")
    other_owner = db.execute(select(models.Team).where(
        models.Team.league_id == team.league_id,
        models.Team.id != team.id,
        models.Team.players.any(models.Player.id == player2_id),
    )).scalars().first()
    if other_owner:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Player to add is already on another team in the league")
    if player1.position != player2.position:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Players must be of the same position to swap")
    team.players.remove(player1)
    team.players.append(player2)
    db.commit()
    db.refresh(team)
    return team
