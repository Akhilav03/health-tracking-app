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

// Define the function above the component where it's used
function getAllDates(startDate, endDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate).toISOString().slice(0, 10)); // Format YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
}

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
                console.log("API Response:", response.data); // Debug API response

                const dataByDate = response.data;
                const allDatesFromData = Object.keys(dataByDate).sort();
                const allDates = getAllDates(allDatesFromData[0], allDatesFromData[allDatesFromData.length - 1]);
                
                const exerciseDurations = allDates.map(date => dataByDate[date]?.duration || 0);
                const dietCalories = allDates.map(date => dataByDate[date]?.calories_intake || 0);

                setChartData({
                    labels: allDates,
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