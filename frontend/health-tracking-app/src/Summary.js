import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Summary = () => {
    const [exerciseSummary, setExerciseSummary] = useState([]);
    const [dietSummary, setDietSummary] = useState([]);

    useEffect(() => {
        const fetchExerciseSummary = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/summary/exercise');
                setExerciseSummary(response.data);
            } catch (error) {
                console.error('Error fetching exercise summary:', error);
            }
        };

        const fetchDietSummary = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/summary/diet');
                setDietSummary(response.data);
            } catch (error) {
                console.error('Error fetching diet summary:', error);
            }
        };

        fetchExerciseSummary();
        fetchDietSummary();
    }, []);

    const handleDeleteExercise = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/exercise/${id}`);
            setExerciseSummary(exerciseSummary.filter((exercise) => exercise.id !== id));
        } catch (error) {
            console.error('Error deleting exercise:', error);
        }
    };

    const handleDeleteDiet = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/diet/${id}`);
            setDietSummary(dietSummary.filter((diet) => diet.id !== id));
        } catch (error) {
            console.error('Error deleting diet:', error);
        }
    };

    return (
        <div className="summary">
            <h2>Exercise Summary</h2>
            <ul>
                {exerciseSummary.map((exercise) => (
                    <li key={exercise.id}>
                        {`${exercise.date} - ${exercise.workout_type}: ${exercise.duration} minutes, ${exercise.intensity} intensity`} {/* Update this line */}
                        <button onClick={() => handleDeleteExercise(exercise.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <h2>Diet Summary</h2>
            <ul>
                {dietSummary.map((diet) => (
                    <li key={diet.id}>
                        {`${diet.date} - ${diet.meal}: ${diet.calories} calories, ${diet.nutrients}`}
                        <button onClick={() => handleDeleteDiet(diet.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Summary;
