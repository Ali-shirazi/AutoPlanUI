import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const ReportingPieChartFifth = ({ detail }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (detail) {
            const totalCapacity =
                (detail.total_times_capacity_hour || 0) * 60 + (detail.total_times_capacity_minute || 0);
            const plannedTime = (detail.total_working_time_hour || 0) * 60 + (detail.total_working_time_minute || 0);
            const unplannedTime = totalCapacity - plannedTime;
            const chartData = [
                {
                    name: 'زمان برنامه ریزی شده',
                    value:
                        (detail.total_working_time_hour || 0) * 60 + (detail.total_working_time_minute || 0),
                },
                {
                    name: 'برنامه ریزی نشده',
                    value:
                    unplannedTime || 0,
                },
            ];

            // Ensure each value is represented relative to the total capacity
            const finalChartData = chartData.map(item => ({
                ...item,
                value: (item.value.toFixed(1) / totalCapacity) * 100, // Convert to percentage of total capacity
            }));

            setData(finalChartData);
        }
    }, [detail]);

    const COLORS = ['#0088FE', '#FF8042']; // Example colors
    const formatNumber = value => `${value.toFixed(1)} %`;

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey='value'
                    nameKey='name'
                    cx="50%" // Center the pie horizontally
                    cy="50%" // Center the pie vertically
                    outerRadius={110} // Increase the radius for larger size
                    // Add inner radius for a donut-like chart
                    labelLine={{
                        stroke: '#333', // Color of the label line
                        strokeWidth: 2, // Thickness of the label line
                        length: 100, // Length before the turn
                        length2: 115, // Length after the turn
                    }}
                    label={({ name, value, cx, cy, midAngle, outerRadius }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 100; // Distance of label from pie
                        const x = cx + radius * Math.cos(-midAngle * RADIAN)+20;
                        const y = cy + radius * Math.sin(-midAngle * RADIAN)-10;

                        return (
                            <text
                                x={x+40}
                                y={y+10}
                                fill="#333"
                                textAnchor={x > cx ? 'start' : 'start'}
                                dominantBaseline="central"
                                fontWeight="bold"
                            >
                                {`${name}: ${formatNumber(value)}`}
                            </text>
                        );
                    }}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={formatNumber} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ReportingPieChartFifth;
