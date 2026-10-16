const API_URL = import.meta.env.VITE_API_URL;

export async function getTeam(teamName) {
    const response = await fetch(`${API_URL}/teams/${teamName}`);
    if (!response.ok) {
        throw new Error('Failed to fetch team');
    }
    const team = await response.json();
    return team.players;
}

export async function getRoster(teamID) {
    const team = await getTeamByID(teamID);
    return team.players;
}

export async function getTeamByID(teamID) {
    const response = await fetch(`${API_URL}/teams/id/${teamID}`);
    if (!response.ok) {
        throw new Error('Failed to fetch roster');
    }
    return response.json();
}

export async function getMatchup(teamName) {
    const response = await fetch(`${API_URL}/teams/${teamName}/matchup`);
    if (!response.ok) {
        throw new Error('Failed to fetch matchup');
    }
    const matchup = await response.json();
    return matchup;
}

export async function getAvailablePlayers(leagueID) {
    const response = await fetch(`${API_URL}/leagues/${leagueID}/available`);
    if (!response.ok) {
        throw new Error('Failed to fetch available players');
    }
    const data = await response.json();
    return data;
}

export async function getAllTeams(leagueID) {
    const response = await fetch(`${API_URL}/leagues/id/${leagueID}`);
    if (!response.ok) {
        throw new Error('Failed to fetch teams');
    }
    const data = await response.json();
    return data.teams;
}

export async function getStandings(leagueID) {
    const teams = await getAllTeams(leagueID);
    let stats = {};
    for (const team of teams) {
        let info = {};
        const teamName = team.name;
        let wins = 0;
        let losses = 0;
        let points = 0.0;
        for (const homeGame of team.home_matchups) {
            points += homeGame.home_score;
            if (homeGame.home_score > homeGame.away_score) {
                wins++;
            } else if (homeGame.home_score < homeGame.away_score) {
                losses++;
            }
        }
        for (const awayGame of team.away_matchups) {
            points += awayGame.away_score;
            if (awayGame.away_score > awayGame.home_score) {
                wins++;
            } else if (awayGame.away_score < awayGame.home_score) {
                losses++;
            }
        }
        info["wins"] = wins;
        info["losses"] = losses;
        info["points"] = points;
        stats[teamName] = info;
    }
    return Object.entries(stats).map(([name, info]) => ({ name, ...info })).sort((a, b) =>
        b.wins - a.wins ||
        b.points - a.points ||
        a.name.localeCompare(b.name, 'en')
    );
}

export async function getPoints(leagueID, playerID) {
    const response = await fetch(`${API_URL}/leagues/id/${leagueID}`);
    const league = await response.json();
    let week = league.current_week;
    week += 5;
    const points = await fetch(`${API_URL}/teams/${week}/${playerID}/score`);
    const score = await points.json();
    return score;
}
