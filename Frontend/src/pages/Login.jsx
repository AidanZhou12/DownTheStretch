import { Link } from 'react-router';
import { useState } from 'react';
import { getTeam } from '../api/login';
import './pages.css';

function LoginPage() {
    const [teamName, setTeamName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    return (
        <main>
            <Link to="/" className="back-button">Back</Link>
            <Link to="/login" className="login-button">Login</Link>
            <h1>Login</h1>
            <div className="login-page">
                <form className="login-form" onSubmit={async (e) => {
                    e.preventDefault();
                    setError('');
                    try {
                        const team = await getTeam(teamName);
                        if (team.password !== password) {
                            throw new Error('Incorrect password');
                        }
                        alert('Login successful! \nYou can now access your team.');
                    } catch (err) {
                        setError(err.message);
                    }
                }}>
                    <div className="form-field">
                        <label>
                            Team Name:
                            <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                        </label>
                    </div>
                    <div className="form-field">
                        <label>
                            Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </label>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        </main>
    );
}

export default LoginPage;