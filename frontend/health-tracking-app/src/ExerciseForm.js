import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const ExerciseForm = () => {
    const [exercise, setExercise] = useState({ type: 'Ring Fit Adventure', duration: '', intensity: '', workoutType: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExercise({ ...exercise, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/exercise', exercise);
            setExercise({ type: 'Ring Fit Adventure', duration: '', intensity: '', workoutType: '' });
        } catch (error) {
            console.error('Error adding exercise:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="workoutType" value={exercise.workoutType} onChange={handleChange} placeholder="Workout Type" required />
            <input name="duration" value={exercise.duration} onChange={handleChange} placeholder="Duration (minutes)" required />
            <input name="intensity" value={exercise.intensity} onChange={handleChange} placeholder="Intensity" required />
            <button type="submit">Log Exercise</button>
        </form>
    );
};

export default ExerciseForm;
