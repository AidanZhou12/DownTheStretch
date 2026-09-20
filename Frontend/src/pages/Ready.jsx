import { Link } from 'react-router';
import './pages.css';

function ReadyPage() {
    return (
        <main>
            <Link to="/" className="back-button">Back</Link>
            <h1>League Ready</h1>
            <div className="ready-page">
                <p>The league is ready to start drafting!</p>
            </div>
        </main>
    );
}

export default ReadyPage;