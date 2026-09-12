import { Link } from 'react-router';

function LoginPage() {
    return (
        <main>
            <Link to="/" className="back-button">Back</Link>
            <h1>Login Page</h1>
        </main>
    );
}

export default LoginPage;