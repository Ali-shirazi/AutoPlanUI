import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';

//Assets
import { LineChartWrapper } from './line-chart.style';

const ReportingPieChart = ({ detail, hours }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (detail && typeof detail === 'object') {
            const chartData = Object.entries(detail)
                .filter(([title, value]) => title !== 'link' && title !== "total_time" && !isNaN(parseFloat(value) ) && !title.includes('تعداد'))
                .map(([title, value]) => ({
                    name: `${title}`,
                    value: hours 
                        ? parseFloat((value / detail.total_time * 100).toFixed(2)) 
                        : parseFloat(value.toFixed(1))
                }));

            setData(chartData);
        }
    }, [detail, hours]);

    const hasValue = data.every(item => item.value === 0);

    // Custom colors for the pie slices
    const COLORS = ['#468585', '#FAFFAF', '#E68369', '#405D72', '#DCA47C', '#3FA2F6', "#FFC7ED", "#E90074", "#088395", "#4C3BCF", "#91DDCF", "#06D001", "#83B4FF", "#AF47D2", "#850F8D", "#01204E", "#8E3E63", "#C3FF93", "#CDE8E5", "#C40C0C", "#FFC100", "#4F6F52", "#F3D0D7", "#A79277", "#481E14", "#F2613F"];

    const formatNumber = value => `${value.toFixed(1)} %`;

    return (
        <>
            {hasValue ? (
                <p className='no_report'>گزارشی موجود نمیباشد</p>
            ) : (
                <LineChartWrapper>
                    <ResponsiveContainer width={'100%'} height={400}>
                        <PieChart width={'100%'} height={'100%'}>
                            <Pie
                                paddingAngle={2}
                                data={data}
                                dataKey='value'
                                nameKey='name'
                                cx="50%" // Center the pie horizontally
                                cy="50%" // Center the pie vertically
                                outerRadius={150} // Increase the radius for larger size
                                innerRadius={100} // Add inner radius for a donut-like chart
                                labelLine={{
                                    stroke: '#333', // Color of the label line
                                    strokeWidth: 2, // Thickness of the label line
                                    length: 100, // Length before the turn
                                    length2: 115, // Length after the turn
                                }}
                                label={({ name, value, cx, cy, midAngle, outerRadius }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = outerRadius + 70; // Distance of label from pie
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                    return (
                                        <text
                                            x={x + 70} // Adjusted x position to add space
                                            y={y+15}
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
                </LineChartWrapper>
            )}
        </>
    );
};

export default ReportingPieChart;
