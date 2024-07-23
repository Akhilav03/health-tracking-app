import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const ExerciseForm = () => {
    const [exercise, setExercise] = useState({ type: '', duration: '', intensity: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExercise({ ...exercise, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/exercise', exercise);
            setExercise({ type: '', duration: '', intensity: '' });
        } catch (error) {
            console.error('Error adding exercise:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="type" value={exercise.type} onChange={handleChange} placeholder="Exercise Type" required />
            <input name="duration" value={exercise.duration} onChange={handleChange} placeholder="Duration" required />
            <input name="intensity" value={exercise.intensity} onChange={handleChange} placeholder="Intensity" required />
            <button type="submit">Add Exercise</button>
        </form>
    );
};

export default ExerciseForm;
