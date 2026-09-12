import { Link } from 'react-router';
import './pages.css';

function JoinLeague() {
    return (
        <main>
            <Link to="/" className="back-button">Back</Link>
            <h1>Join League</h1>
        </main>
    );
}

export default JoinLeague;