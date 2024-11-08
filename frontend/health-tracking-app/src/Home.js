import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExerciseForm from './ExerciseForm';
import DietForm from './DietForm';
import Summary from './Summary';
import './App.css';

const Home = ({ isLoggedIn, user }) => {
    const navigate = useNavigate();


    const handleLogout = () => {
        console.log("User logged out");
        
    };
        
    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#e1ebf1', color: 'white' }}>
                
                <h1>Health Tracking App</h1>
                <div>
                    <center>Welcome Back!</center>
                </div>
                <nav>
                    {isLoggedIn ? (
                        <>
                            <span>Welcome back, {user.username}!</span>
                            <Link to="/account" style={{ margin: '0 10px' }}>Account</Link>
                            <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/" style={{ marginRight: '10px' }}>Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </header>
            <ExerciseForm />
            <DietForm />
            <Summary />
            <div style={{ textAlign: 'center' }}>
                <Link to="/summary">
                    <button>View Summary Chart</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
