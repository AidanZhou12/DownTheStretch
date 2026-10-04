from fastapi import Depends, APIRouter, status, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
import models
from database import get_db
from typing import Annotated
from schemas import TeamBase, TeamCreate, TeamResponse, DraftRequest, DraftResponse, LeagueResponse, MatchupResponse, PlayerResponse

router = APIRouter()

@router.patch("/{league_id}/start", response_model=DraftResponse)
def start_draft(league_id: int, db: Annotated[Session, Depends(get_db)]):
    league = db.execute(select(models.League).where(models.League.id == league_id).options(selectinload(models.League.teams), selectinload(models.League.draft))).scalar_one_or_none()
    if not league:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="League not found")
    if league.draft.status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Draft has already started or completed")
    league.draft.status = "started"
    db.commit()
    db.refresh(league.draft)
    return league.draft