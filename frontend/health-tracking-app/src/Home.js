import React from 'react';
import { Link } from 'react-router-dom';
import ExerciseForm from './ExerciseForm';
import DietForm from './DietForm';
import Summary from './Summary';
import './App.css';

const Home = () => {
    return (
        <div>
            <ExerciseForm />
            <DietForm />
            <Summary />
            <Link to="/summary">
                <button>View Summary Chart</button>
            </Link>
        </div>
    );
};

export default Home;
