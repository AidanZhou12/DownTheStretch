from pydantic import BaseModel, ConfigDict

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    password: str
    league_id: int

class TeamResponse(TeamBase):
    id: int
    league_id: int
    draft_position: int
    players: list["PlayerResponse"] = []
    home_matchups: list["MatchupResponse"] = []
    away_matchups: list["MatchupResponse"] = []

    model_config = ConfigDict(from_attributes=True)
