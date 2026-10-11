import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { getTeam } from '../api/league';
import './pages.css';

const TABS = ['Team', 'Matchup', 'Waivers', 'Standings'];
const POSITION_ORDER = { QB: 0, RB: 1, WR: 2, TE: 3 };

function LeaguePage() {
    const [activeTab, setActiveTab] = useState(0);
    const [roster, setRoster] = useState([]);
    const tabRefs = useRef([]);
    const { state } = useLocation();
    const teamName = state?.teamName;
    const leagueID = state?.leagueID;
    const sortedRoster = [...roster].sort((a, b) =>
        (POSITION_ORDER[a.position] ?? 4) - (POSITION_ORDER[b.position] ?? 4)
    );

    function handleTabKeyDown(event, index) {
        let nextTab;
        if (event.key === 'ArrowRight') nextTab = (index + 1) % TABS.length;
        else if (event.key === 'ArrowLeft') nextTab = (index - 1 + TABS.length) % TABS.length;
        else if (event.key === 'Home') nextTab = 0;
        else if (event.key === 'End') nextTab = TABS.length - 1;
        else return;

        event.preventDefault();
        setActiveTab(nextTab);
        tabRefs.current[nextTab].focus();
    }

    useEffect(() => {
        if (!teamName || !leagueID) return;
        async function fetchRoster() {
            try {
                const teamRoster = await getTeam(teamName);
                setRoster(teamRoster);
            } catch (error) {
                console.error('Error fetching roster:', error);
            }
        }

        fetchRoster();
    }, [teamName, leagueID]);

    if (!teamName || !leagueID) {
        return (
            <main>
                <p>Error: Missing team name or league ID.</p>
                <Link to="/login">Go back to login</Link>
            </main>
        );
    }

    return (
        <main className="league-page">
            <div className="league-tabs" role="tablist" aria-label="League sections">
                {TABS.map((label, index) => (
                    <button
                        key={label}
                        ref={element => { tabRefs.current[index] = element; }}
                        type="button"
                        role="tab"
                        id={`league-tab-${index}`}
                        aria-controls={`league-panel-${index}`}
                        aria-selected={activeTab === index}
                        tabIndex={activeTab === index ? 0 : -1}
                        onClick={() => setActiveTab(index)}
                        onKeyDown={event => handleTabKeyDown(event, index)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {TABS.map((label, index) => (
                <section
                    key={label}
                    role="tabpanel"
                    id={`league-panel-${index}`}
                    aria-labelledby={`league-tab-${index}`}
                    hidden={activeTab !== index}
                    tabIndex={0}
                >
                    <h1>{label}</h1>
                    {label === 'Team' && (
                        <div className="league-roster">
                            {sortedRoster.map(player => (
                                <div className="league-roster-row" key={player.id}>
                                    <span>{player.position}: {player.name}</span>
                                    <span className="league-roster-school">{player.school}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {label === 'Matchup' && (
                        <p>Matchup placeholder: add your weekly matchup content here.</p>
                    )}
                    {label === 'Waivers' && (
                        <p>Waivers placeholder: add available players and roster changes here.</p>
                    )}
                    {label === 'Standings' && (
                        <p>Standings placeholder: add your league rankings here.</p>
                    )}
                </section>
            ))}
        </main>
    );
}

export default LeaguePage;
