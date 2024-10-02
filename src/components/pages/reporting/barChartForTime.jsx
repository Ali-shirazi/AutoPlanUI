import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarChartForTime = ({ detail }) => {
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
            console.log(detail, "details");
            Object.entries(detail)?.map(([title, value]) => {
                console.log(title, value, "details2");
                title !== 'link' &&
                    Object.entries(value)?.map(([innerTitle, innerValue]) => {
                        setData(prev => [
                            ...prev,
                            {
                                name: innerTitle,
                                delay_end: parseTimeString(innerValue?.delay_end_time),
                                delay_start: parseTimeString(innerValue?.delay_start_time),
                                rush_end: parseTimeString(innerValue?.rush_end_time),
                                rush_start: parseTimeString(innerValue?.rush_start_time)
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
                            bottom: 20
                        }}
                    >
                        <CartesianGrid strokeLinecap='1' vertical={false} stroke='#f2f2f2' />
                        <XAxis
                            height={60} 
                            fontWeight={'bold'}
                            dataKey='name' 
                            tickLine={false} 
                            interval={0} 
                            tickMargin={10} 
                            tick={{ angle: -90, textAnchor: 'start', dy: 10 }} />
                        <YAxis tick={{ dy: -5, dx: -40 }} axisLine={false} tickLine={false}
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={formatTime}
                            interval={0}
                            allowDecimals={false}
                            fontWeight={'bold'}
                        />
                        <Tooltip content={<CustomTooltip />} />
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

export default BarChartForTime;
