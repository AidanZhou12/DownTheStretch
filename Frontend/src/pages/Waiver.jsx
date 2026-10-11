import { useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getPosition, addPlayerToTeam } from '../api/waiver';
import './pages.css';

function WaiverPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const teamName = state?.teamName;
    const position = state?.player?.position ?? state?.position;

    useEffect(() => {
        if (!teamName || !position) {
            return;
        }

        let cancelled = false;
        async function loadPlayers() {
            try {
                const fetchedPlayers = await getPosition(teamName, position);
                if (!cancelled) setPlayers(fetchedPlayers);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadPlayers();
        return () => { cancelled = true; };
    }, [teamName, position]);

    async function handleSwap(playerToDrop) {
        setSubmitting(true);
        setError('');
        try {
            await addPlayerToTeam(teamName, playerToDrop.id, state.player.id);
            navigate('/league', { state: { teamName, leagueID: state.leagueID } });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (!teamName || !position || !state?.player?.id) {
        return <main className="league-page"><p>Missing team or selected player. Return to the league and select a player to add.</p></main>;
    }

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <main className="league-page waiver-page">
            <h1>Adding {state?.player?.name}</h1>
            <h2>Select the {position} to drop</h2>
            {error && <p role="alert">{error}</p>}
            <div className="league-roster">
                {players.map((player) => (
                    <div key={player.id} className="league-roster-row">
                        <span>{player.position}: {player.name}</span>
                        <button
                            type="button"
                            disabled={submitting || !state?.player?.id}
                            onClick={() => handleSwap(player)}
                        >
                            Drop
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default WaiverPage;
