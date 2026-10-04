import { Link, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import './pages.css';

function EnterPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    return (
        <main>
            <Link to="/" className="back-button">Back</Link>
            <h1>Draft Started</h1>
            <div className="enter-page">
                <p>Someone in your league started the draft. Join the draft.</p>
                <button onClick={async () => {
                    setError('');
                    navigate('/draft', { state: { teamName: state.teamName, leagueID: state.leagueID } });
                }}>Enter Draft</button>
                {error && <p className="error">{error}</p>}
            </div>
        </main>
    );
}

export default EnterPage;