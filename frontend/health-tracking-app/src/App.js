


import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import SummaryChart from './SummaryChart';
import './App.css';

const App = () => {
    const [user, setUser] = useState(null);
    
    const login = (username) => {

        setUser({ username });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/home" element={<Home isLoggedIn={!!user} user={user} />} />
                    <Route path="/" element={<LoginForm onLogin={login} />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/summary" element={<SummaryChart />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
