import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './App.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SummaryChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/summary');
                const exercises = response.data.exercises || [];
                const diets = response.data.diets || [];

                // Process data for the chart
                const exerciseDates = exercises.map(ex => ex.date);
                const exerciseDurations = exercises.map(ex => ex.duration);

                const dietDates = diets.map(dt => dt.date);
                const dietCalories = diets.map(dt => dt.calories);

                setChartData({
                    labels: exerciseDates, // Assuming exercises and diets have the same dates
                    datasets: [
                        {
                            label: 'Exercise Duration',
                            data: exerciseDurations,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: false,
                        },
                        {
                            label: 'Diet Calories',
                            data: dietCalories,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: false,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching summary data:', error);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className="chart-container">
            <h2>Summary Chart</h2>
            <Line data={chartData} />
            <div style={{ textAlign: 'center' }}>
                <button onClick={() => navigate('/')}>Go Back</button>
            </div>
        </div>
    );
};

export default SummaryChart;
