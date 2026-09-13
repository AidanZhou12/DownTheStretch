from fastapi import Depends, APIRouter, status, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from database import get_db
from typing import Annotated

router = APIRouter()