from sqlalchemy import CheckConstraint, Column, String, ForeignKey, Table
from sqlalchemy.orm import relationship, Mapped, mapped_column
from database import Base

player_team_association = Table(
    "player_team",
    Base.metadata,
    Column("player_id", ForeignKey("players.id"), primary_key=True),
    Column("team_id", ForeignKey("teams.id"), primary_key=True),
)

class League(Base):
    __tablename__ = "leagues"

    id: Mapped[int] = mapped_column(primary_key=True)
    teams: Mapped[list["Team"]] = relationship(back_populates="league")
    matchups: Mapped[list["Matchup"]] = relationship(back_populates="league")

class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    league_id: Mapped[int] = mapped_column(ForeignKey("leagues.id"), nullable=False)
    league: Mapped["League"] = relationship(back_populates="teams")
    draft_position: Mapped[int] = mapped_column(nullable=False)
    players: Mapped[list["Player"]] = relationship(secondary=player_team_association, back_populates="teams")
    home_matchups: Mapped[list["Matchup"]] = relationship(foreign_keys="[Matchup.home_team_id]", back_populates="home_team")
    away_matchups: Mapped[list["Matchup"]] = relationship(foreign_keys="[Matchup.away_team_id]", back_populates="away_team")

class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True)
    cfbd_id: Mapped[int] = mapped_column(unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    school: Mapped[str] = mapped_column(String(100), nullable=False)
    position: Mapped[str] = mapped_column(String(10), nullable=False)
    teams: Mapped[list["Team"]] = relationship(secondary=player_team_association, back_populates="players")

class Matchup(Base):
    __tablename__ = "matchups"

    id: Mapped[int] = mapped_column(primary_key=True)
    week: Mapped[int] = mapped_column(nullable=False)
    home_team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    away_team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    home_team: Mapped["Team"] = relationship(foreign_keys=[home_team_id], back_populates="home_matchups")
    away_team: Mapped["Team"] = relationship(foreign_keys=[away_team_id], back_populates="away_matchups")
    league_id: Mapped[int] = mapped_column(ForeignKey("leagues.id"), nullable=False)
    league: Mapped["League"] = relationship(back_populates="matchups")
    matchup_type: Mapped[str] = mapped_column(String(20), default="regular")
    home_score: Mapped[float | None] = mapped_column(nullable=True)
    away_score: Mapped[float | None] = mapped_column(nullable=True)

    __table_args__ = (
        CheckConstraint(
            "home_team_id != away_team_id",
            name="unique_matchup_teams"
        ),
    )