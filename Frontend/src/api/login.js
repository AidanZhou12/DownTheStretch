const API_URL = import.meta.env.VITE_API_URL;

export async function loginTeam(teamName, password) {
    const response = await fetch(`${API_URL}/teams/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName, password }),
    });
    if (!response.ok) {
        throw new Error(response.status === 401
            ? 'Invalid team name or password'
            : 'Failed to log in');
    }
    return response.json();
}

export async function getCount(leagueID) {
    const response = await fetch(`${API_URL}/leagues/id/${leagueID}`);
    if (!response.ok) {
        throw new Error('Failed to fetch league');
    }
    const league = await response.json();
    return league.teams.length;
}

export async function getDraftStatus(leagueID) {
    const response = await fetch(`${API_URL}/leagues/id/${leagueID}`);
    if (!response.ok) {
        throw new Error('Failed to fetch league');
    }
    const league = await response.json();
    return league.draft.status;
}