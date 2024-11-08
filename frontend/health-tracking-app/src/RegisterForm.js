import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [userInfo, setUserInfo] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserInfo({...userInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(userInfo);
        navigate('/'); // Redirect to login on successful registration
    };

    return (
        <div className="login-register-container">
            <form className="login-register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <input type="text" name="username" placeholder="Username" value={userInfo.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={userInfo.password} onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
