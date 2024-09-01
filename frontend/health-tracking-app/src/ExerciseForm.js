import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const ExerciseForm = () => {
    const [exercise, setExercise] = useState({
        type: '', duration: '', difficultyLevel: '',
        caloriesBurned: '', distanceRun: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExercise({ ...exercise, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/exercise', exercise);
            setExercise({
                type: '', duration: '', difficultyLevel: '',
                caloriesBurned: '', distanceRun: ''
            });
        } catch (error) {
            console.error('Error adding exercise:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="type" value={exercise.type} onChange={handleChange} placeholder="Exercise Type (Optional)" />
            <input name="duration" value={exercise.duration} onChange={handleChange} placeholder="Duration (minutes)" required />
            <input name="difficultyLevel" value={exercise.difficultyLevel} onChange={handleChange} placeholder="Difficulty Level" required />
            <input name="caloriesBurned" value={exercise.caloriesBurned} onChange={handleChange} placeholder="Calories Burned" required />
            <input name="distanceRun" value={exercise.distanceRun} onChange={handleChange} placeholder="Distance Run (km)" required />
            <button type="submit">Log Exercise</button>
        </form>
    );
};

export default ExerciseForm;
