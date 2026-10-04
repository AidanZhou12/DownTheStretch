import { Link, useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getDraftStatus, draftPlayer, getRoster, getAvailablePlayers, getTeams, whosTurn, pickingTeam as findPickingTeam } from '../api/draft';
import './pages.css';

function DraftPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [positionFilter, setPositionFilter] = useState('All');
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [draftStatus, setDraftStatus] = useState('');
    const [currentPick, setCurrentPick] = useState(null);
    const [currentTurn, setCurrentTurn] = useState(null);
    const [pickingTeam, setPickingTeam] = useState(null);

    const [roster, setRoster] = useState([]);
    const leagueID = state?.leagueID;
    const teamName = state?.teamName;

    useEffect(() => {
        if (!leagueID || !teamName) return;

        let cancelled = false;

        async function loadDraft() {
            setLoading(true);

            try {
                const [draft, teams, players, roster] = await Promise.all([
                    getDraftStatus(leagueID),
                    getTeams(leagueID),
                    getAvailablePlayers(leagueID),
                    getRoster(teamName),
                ]);

                if (cancelled) return;

                const turn = whosTurn(draft.current_pick);

                setDraftStatus(draft.status);
                setCurrentPick(draft.current_pick);
                setCurrentTurn(turn);
                setPickingTeam(findPickingTeam(teams, turn));
                setAvailablePlayers(players);
                setRoster(roster);
                setError('');
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadDraft();

        return () => {
            cancelled = true;
        };
    }, [leagueID, teamName]);

    if (!leagueID || !teamName) {
        return <Link to="/login">Log in to enter the draft</Link>;
    }

    if (draftStatus === 'completed') {
        return (
            <main>
                <h1>Draft Completed</h1>
                <p>The draft has been completed. You may now enter the league page.</p>
                <Link to="/league" state={{ teamName: state.teamName, leagueID: state.leagueID }}>Enter League</Link>
            </main>
        );
    }

    else {
        return (
            <main>
                <h1>Draft Page</h1>
                <h2>Picking: {pickingTeam}</h2>
                <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="QB">QB</option>
                    <option value="RB">RB</option>
                    <option value="WR">WR</option>
                    <option value="TE">TE</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <h2>Available Players</h2>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <table><tbody>
                {availablePlayers.map((player) => <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.position}</td>
                    <td>{player.school}</td>
                    <td><button onClick={() => draftPlayer(teamName, player.id)}>Draft</button></td>
                </tr>)}
                </tbody></table>
                <h2>Your Team</h2>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <table><tbody>
                {roster.map((player) => <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.position}</td>
                    <td>{player.school}</td>
                </tr>)}
                </tbody></table>
            </main>
        )
    }
}

export default DraftPage;