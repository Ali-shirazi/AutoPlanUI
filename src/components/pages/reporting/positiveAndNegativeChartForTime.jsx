import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const PNChartForTime = ({ detail }) => {
    const [data, setData] = useState([]);

    const parseTimeString = (timeStr) => {
        const regex = /(\d+)h (\d+)m/;
        const match = timeStr.match(regex);
        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            return hours * 60 + minutes;
        }
        return 0;
    };

    const formatTime = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    const CustomTooltip = ({ payload, label }) => {
        if (!payload || payload.length === 0) return null;

        return (
            <div style={{
                fontSize: '14px',
                padding: '10px',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '5px',
            }}>
                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ padding: '5px 0', color: entry.fill }}>
                        {entry.name}: {formatTime(entry.value)}
                    </p>
                ))}
            </div>
        );
    };

    useEffect(() => {
        if (detail) {
            setData([]);
            Object.entries(detail)?.map(([title, value]) => {
                title !== 'link' &&
                    Object.entries(value)?.map(([innerTitle, innerValue]) => {
                        setData(prev => [
                            ...prev,
                            {
                                name: innerTitle,
                                delay_end: -parseTimeString(innerValue?.delay_end_time),  // Set delay_end as negative
                                delay_start: -parseTimeString(innerValue?.delay_start_time),  // Set delay_start as negative
                                rush_end: parseTimeString(innerValue?.rush_end_time),  // Ensure rush_end is positive
                                rush_start: parseTimeString(innerValue?.rush_start_time)  // Ensure rush_start is positive
                            }
                        ]);
                    });
            });
        }
    }, [detail]);

    return (
        <>
            {data.length ? (
                <ResponsiveContainer width='100%' height={400}>
                    <BarChart
                        width={500}
                        height={400}
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 20,
                            bottom: 80  // Increase bottom margin to accommodate rotated labels
                        }}
                    >
                        <CartesianGrid strokeLinecap='1' vertical={false} stroke='#f2f2f2' />
                        <XAxis
                            fontWeight={'bold'}
                            dataKey='name'
                            tickLine={false}
                            interval={0}
                            tickMargin={10}
                            tick={{ angle: -90, textAnchor: 'start', dy: 10 }}
                        />
                        <YAxis
                            tick={{ dy: -10, dx: -40 }}
                            axisLine={false}
                            tickLine={false}
                            fontWeight={'bold'}
                            tickFormatter={formatTime}
                            domain={['dataMin', 'dataMax']}  // Adjust Y-axis to accommodate positive and negative values
                            tickCount={6}  // Set the number of ticks; adjust as needed
                            allowDecimals={false}  // Only whole numbers
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#000" strokeWidth={2} /> {/* Base dividing line */}
                        <Bar dataKey='delay_end' name='تاخیر در پایان' fill='#95A4FC' />
                        <Bar dataKey='delay_start' name='تاخیر در شروع' fill='#174787' />
                        <Bar dataKey='rush_end' name='تعجیل در پایان' fill='#800000' />
                        <Bar dataKey='rush_start' name='تعجیل در شروع' fill='#F5004F' />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className='no_report'>گزارشی موجود نمیباشد</p>
            )}
        </>
    );
};

export default PNChartForTime;
