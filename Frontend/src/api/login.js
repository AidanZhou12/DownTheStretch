const API_URL = import.meta.env.VITE_API_URL;

export async function getTeam(teamName) {
    const response = await fetch(`${API_URL}/teams/${teamName}`);
    if (!response.ok) {
        throw new Error('Failed to fetch team');
    }
    return await response.json();
}

export async function getCount(leagueID) {
    const response = await fetch(`${API_URL}/leagues/id/${leagueID}`);
    if (!response.ok) {
        throw new Error('Failed to fetch league');
    }
    const league = await response.json();
    return league.teams.length;
}