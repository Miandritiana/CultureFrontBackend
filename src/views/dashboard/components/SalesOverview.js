import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import { useState, useEffect } from 'react';


const SalesOverview = () => {

    // select
    const [month, setMonth] = React.useState('1');

    const handleChange = (event) => {
        setMonth(event.target.value);
    };

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    // chart
    const [chartData, setChartData] = useState({
        options: {
            // your existing options
        },
        series: [],
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories
        fetch('http://localhost:8080/categoriecultures/')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            })
            .catch(error => {
                console.error('Error during fetch categories:', error);
            });

        // Fetch chart data
        fetch('http://localhost:8080/categoriecultures/statistiques')
            .then(response => response.json())
            .then(data => {
                // Update the state with the response data
                setChartData({
                    ...chartData,
                    series: Object.keys(data).map(categoryName => ({
                        name: categoryName,
                        data: [data[categoryName], ...chartData.series.find(s => s.name === categoryName)?.data.slice(0, -1) || Array(7).fill(0)],
                    })),
                });
            })
            .catch(error => {
                console.error('Error during fetch chart data:', error);
            });
    }, []);

    return (

        <DashboardCard title="Sales Overview" action={
            <Select
                labelId="month-dd"
                id="month-dd"
                value={month}
                size="small"
                onChange={handleChange}
            >
                <MenuItem value={1}>March 2023</MenuItem>
                <MenuItem value={2}>April 2023</MenuItem>
                <MenuItem value={3}>May 2023</MenuItem>
            </Select>
        }>
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height="370px"
            />
        </DashboardCard>
        
    );
};

export default SalesOverview;
