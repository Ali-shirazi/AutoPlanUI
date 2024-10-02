import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, Grid } from '@mui/material';

const COLORS = ['#468585', '#E68369', '#405D72', '#DCA47C'];

const PiechartForSixMonth = ({ detail }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (detail) {

            const chartData = Object.entries(detail)
                .filter(([key]) => key !== 'link')
                .map(([key, value]) => ({
                    name: key,
                    delay_end: (value?.delay_end/(value?.delay_end + value?.delay_start + value?.rush_end + value?.rush_start))*100,
                    delay_start: (value?.delay_start/(value?.delay_end + value?.delay_start + value?.rush_end + value?.rush_start))*100,
                    rush_end: (value?.rush_end/(value?.delay_end + value?.delay_start + value?.rush_end + value?.rush_start))*100,
                    rush_start: (value?.rush_start/(value?.delay_end + value?.delay_start + value?.rush_end + value?.rush_start))*100
                }));

            setData(chartData);
        }
    }, [detail]);

    const formatNumber = (value) => `${value.toFixed(1)} %`;

    const renderPieCharts = () => {
        return data.map((monthData, index) => {
            const pieData = [
                { name: 'تاخیر در پایان', value: monthData.delay_end },
                { name: 'تاخیر در شروع', value: monthData.delay_start },
                { name: 'تعجیل در پایان', value: monthData.rush_end },
                { name: 'تعجیل در شروع', value: monthData.rush_start }
            ];

            return (
                <Grid item xs={12} sm={12} md={6} key={index}>
                    <Box textAlign="center">
                        <Typography variant="body2" margin={2} component="p" color="textSecondary">
                            {monthData.name}
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={60}
                                    innerRadius={0}
                                    labelLine={{
                                        stroke: '#333',
                                        strokeWidth: 2,
                                        length: 100,
                                        length2: 115,
                                    }}
                                    label={({ name, value, cx, cy, midAngle, outerRadius }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = outerRadius + 50;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN) - 10;
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text
                                                x={x + 40} // Adjusted x position to add space
                                                y={y + 5}
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
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={formatNumber} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>
            );
        });
    };

    return (
        <>
            {data.length ? (
                <Grid container spacing={4} justifyContent="center">
                    {renderPieCharts()}
                </Grid>
            ) : (
                <p className="no_report">گزارشی موجود نمیباشد</p>
            )}
        </>
    );
};

export default PiechartForSixMonth;
