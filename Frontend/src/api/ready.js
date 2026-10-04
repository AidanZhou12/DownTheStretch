const API_URL = import.meta.env.VITE_API_URL;


export async function startDraft(leagueID) {
    const response = await fetch(`${API_URL}/drafts/${leagueID}/start`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to start draft');
    }

    return response.json();
}

export async function getLeagueID(teamName) {
    const response = await fetch(`${API_URL}/teams/${teamName}`);
    if (!response.ok) {
        throw new Error('Failed to fetch team');
    }
    const team = await response.json();
    return team.league_id;
}