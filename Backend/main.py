from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from routers import teams, league, draft

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teams.router, prefix="/teams", tags=["teams"])
app.include_router(league.router, prefix="/leagues", tags=["leagues"])
app.include_router(draft.router, prefix="/drafts", tags=["drafts"])