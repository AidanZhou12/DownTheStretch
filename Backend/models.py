from sqlalchemy import Column, String, ForeignKey, Table
from sqlalchemy.orm import relationship, Mapped, mapped_column
from database import Base

player_team_association = Table(
    "player_team",
    Base.metadata,
    Column("player_id", ForeignKey("player.id"), primary_key=True),
    Column("team_id", ForeignKey("team.id"), primary_key=True),
)

class League(Base):
    __tablename__ = "leagues"

    id: Mapped[int] = mapped_column(primary_key=True)
    drafted: Mapped[bool] = mapped_column(default=False)
    teams: Mapped[list[Team]] = relationship(back_populates="league")

class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    league_id: Mapped[int] = mapped_column(ForeignKey("leagues.id"), nullable=False)
    league: Mapped[League] = relationship(back_populates="teams")
    draft_position: Mapped[int] = mapped_column(nullable=False)
    players: Mapped[list[Player]] = relationship(secondary=player_team_association, back_populates="teams")

class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True)
    cfbd_id: Mapped[int] = mapped_column(unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    school: Mapped[str] = mapped_column(String(100), nullable=False)
    position: Mapped[str] = mapped_column(String(10), nullable=False)
    teams: Mapped[list[Team]] = relationship(secondary=player_team_association, back_populates="players")