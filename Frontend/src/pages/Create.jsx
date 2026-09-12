import { Link } from 'react-router';
import './pages.css';

function CreateLeague() {
    return (
        <main>
            <Link to="/" className="back-button">Back</Link>
            <h1>Create League</h1>
        </main>
    );
}

export default CreateLeague;