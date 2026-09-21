import { Link } from 'react-router';
import './pages.css';

function UnreadyPage() {
    return (
        <main>
            <Link to="/" className="back-button">Back</Link>
            <h1>League Not Ready</h1>
            <div className="unready-page">
                <p>Your league does not have enough players to start drafting yet.</p>
            </div>
        </main>
    );
}

export default UnreadyPage;