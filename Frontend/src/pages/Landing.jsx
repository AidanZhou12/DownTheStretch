import { Link } from 'react-router';

function LandingPage() {
    return (
        <div>
            <h1>Welcome to Down the Stretch!</h1>
            <Link to="/login">Login</Link>
        </div>
    );
}

export default LandingPage;