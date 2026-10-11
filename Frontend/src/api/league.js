const API_URL = import.meta.env.VITE_API_URL;

export async function getTeam(teamName) {
    const response = await fetch(`${API_URL}/teams/${teamName}`);
    if (!response.ok) {
        throw new Error('Failed to fetch team');
    }
    const team = await response.json();
    return team.players;
}