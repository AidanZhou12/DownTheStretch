import { Link, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { getDraftStatus, draftPlayer, getRoster, getAvailablePlayers, getTeams, whosTurn } from '../api/draft';
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

    const teams = getTeams(state.leagueID);

    useEffect(() => {
        setLoading(true);
        getDraftStatus(state.leagueID).then((status) => {
            setDraftStatus(status.status);
            setCurrentPick(status.current_pick);
            setCurrentTurn(whosTurn(currentPick));
            setPickingTeam(pickingTeam(teams, currentTurn));
        });
        getRoster(state.teamName)
        getAvailablePlayers(state.leagueID).then((players) => {
            setAvailablePlayers(players);
        }).catch((err) => {
            setError(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }, [state]);

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
                {availablePlayers.map((player) => <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.position}</td>
                    <td>{player.school}</td>
                    <td><button onClick={() => draftPlayer(state.leagueID, state.teamName, player.id)}>Draft</button></td>
                </tr>)}
                <h2>Your Team</h2>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {getRoster(state.teamName).map((player) => <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.position}</td>
                    <td>{player.school}</td>
                </tr>)}
            </main>
        )
    }
}

export default DraftPage;