from fastapi import Depends, APIRouter, status, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from database import get_db
import models
from typing import Annotated
from schemas import TeamCreate, TeamBase, TeamResponse

router = APIRouter()