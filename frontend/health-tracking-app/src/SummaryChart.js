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
                console.log("API Response:", response.data);

                const entries = response.data;
                const labels = entries.map((entry, index) => `Entry ${index + 1}`);
                const caloriesBurned = entries.map(entry => entry.calories_burned || 0);
                const exerciseDurations = entries.map(entry => entry.duration || 0);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Calories Burned',
                            data: caloriesBurned,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: false,
                        },
                        {
                            label: 'Exercise Duration (minutes)',
                            data: exerciseDurations,
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
