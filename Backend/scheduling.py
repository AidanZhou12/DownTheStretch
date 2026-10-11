"""Regular-season scheduling for six-team leagues."""

from sqlalchemy import select
from sqlalchemy.orm import Session

import models

# Each pair is (home draft position, away draft position).
REGULAR_SEASON_WEEKS = (
    ((1, 5), (6, 4), (2, 3)),
    ((1, 4), (5, 3), (6, 2)),
    ((3, 1), (4, 2), (5, 6)),
    ((2, 1), (3, 6), (4, 5)),
)


def generate_regular_season_schedule(
    db: Session, league: models.League
) -> list[models.Matchup]:
    """Add 12 games without committing; return an existing matching schedule.

    The caller commits the schedule with draft completion. An incomplete or
    conflicting existing schedule is rejected rather than duplicated/replaced.
    """
    teams = league.teams
    if len(teams) != 6 or {team.draft_position for team in teams} != set(range(1, 7)):
        raise ValueError("Scheduling requires six teams with draft positions 1 through 6")

    teams_by_position = {team.draft_position: team for team in teams}
    expected = {
        (week, teams_by_position[home].id, teams_by_position[away].id)
        for week, games in enumerate(REGULAR_SEASON_WEEKS, start=1)
        for home, away in games
    }
    with db.no_autoflush:
        existing = list(db.scalars(select(models.Matchup).where(
            models.Matchup.league_id == league.id,
            models.Matchup.matchup_type == "regular",
        )))
    existing.extend(
        game for game in db.new
        if isinstance(game, models.Matchup)
        and game.league_id == league.id
        and game.matchup_type == "regular"
    )
    if existing:
        actual = {(game.week, game.home_team_id, game.away_team_id) for game in existing}
        if len(existing) != 12 or actual != expected:
            raise ValueError("League already has an incomplete or conflicting regular-season schedule")
        return existing

    games = [
        models.Matchup(
            league_id=league.id,
            week=week,
            home_team_id=teams_by_position[home].id,
            away_team_id=teams_by_position[away].id,
            matchup_type="regular",
        )
        for week, pairs in enumerate(REGULAR_SEASON_WEEKS, start=1)
        for home, away in pairs
    ]
    db.add_all(games)
    return games
