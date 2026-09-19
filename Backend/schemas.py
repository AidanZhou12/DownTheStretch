from pydantic import BaseModel, ConfigDict

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    password: str
    league_id: int

class TeamResponse(TeamBase):
    id: int
    password: str
    league_id: int
    draft_position: int
    players: list["PlayerResponse"] = []
    home_matchups: list["MatchupResponse"] = []
    away_matchups: list["MatchupResponse"] = []

    model_config = ConfigDict(from_attributes=True)

class LeagueBase(BaseModel):
    name: str

class LeagueCreate(LeagueBase):
    pass

class LeagueResponse(LeagueBase):
    id: int
    teams: list[TeamResponse] = []
    draft: "DraftResponse" | None = None
    matchups: list["MatchupResponse"] = []
    current_week: int

    model_config = ConfigDict(from_attributes=True)

class MatchupCreate(BaseModel):
    week: int
    home_team_id: int
    away_team_id: int
    league_id: int
    matchup_type: str | None = "regular"

class MatchupResponse(BaseModel):
    id: int
    week: int
    home_team_id: int
    away_team_id: int
    league_id: int
    matchup_type: str
    home_score: float | None = 0.0
    away_score: float | None = 0.0

    model_config = ConfigDict(from_attributes=True)

class PlayerResponse(BaseModel):
    id: int
    cfbd_id: int
    name: str
    school: str
    position: str
    teams: list[TeamResponse] = []

    model_config = ConfigDict(from_attributes=True)

class DraftRequest(BaseModel):
    league_id: int
    player_id: int
    team_id: int

class DraftResponse(BaseModel):
    id: int
    league_id: int
    current_pick: int
    status: str

    model_config = ConfigDict(from_attributes=True)
