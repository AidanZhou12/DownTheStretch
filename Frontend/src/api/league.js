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
