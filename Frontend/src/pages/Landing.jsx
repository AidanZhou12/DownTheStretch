import { Link } from 'react-router';
import './Landing.css';

function LandingPage() {
    return (
        <main>
            <Link to="/login" className="login-button">Login</Link>

            <h1>Down The Stretch</h1>

            <p>Welcome to Down The Stretch!</p>

            <div className="landing-actions">
                <Link to="/create" className="action-button">Create League</Link>
                <Link to="/join" className="action-button">Join League</Link>
            </div>
        </main>
    );
}

export default LandingPage;