import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const DietForm = () => {
    const [diet, setDiet] = useState({ meal: '', calories: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiet({ ...diet, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/diet', diet);
            setDiet({ meal: '', calories: '' });
        } catch (error) {
            console.error('Error adding diet:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="meal" value={diet.meal} onChange={handleChange} placeholder="Meal" required />
            <input name="calories" value={diet.calories} onChange={handleChange} placeholder="Calories" required />
            <button type="submit">Add Diet</button>
        </form>
    );
};

export default DietForm;
