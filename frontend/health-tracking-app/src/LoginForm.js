import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(''); // State to hold login error
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', credentials);
            console.log(response.data);

            navigate('/home');
        } catch (error) {

            console.error('Login failed:', error.response?.data || 'Error');
            setError('Failed to login. Check your username and password.');
        }
    };

    return (
        <div className="login-register-container">
            <form className="login-register-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input type="text" name="username" placeholder="Username" value={credentials.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}  
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
    );
};

export default Login;
