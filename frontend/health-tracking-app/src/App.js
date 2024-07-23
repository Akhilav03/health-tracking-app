import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import SummaryChart from './SummaryChart';
import './App.css';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Health Tracking App</h1>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/summary" element={<SummaryChart />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

