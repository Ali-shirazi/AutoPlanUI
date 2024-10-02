import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PNChart = ({ detail }) => {
    const [data, setData] = useState([]);

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
                                delay_end: -Math.abs(innerValue?.delay_end),  // Set delay_end as negative
                                delay_start: -Math.abs(innerValue?.delay_start),  // Set delay_start as negative
                                rush_end: Math.abs(innerValue?.rush_end),  // Ensure rush_end is positive
                                rush_start: Math.abs(innerValue?.rush_start)  // Ensure rush_start is positive
                            }
                        ]);
                    });
            });
        }
    }, [detail]);

    return (
        <>
            {data.length ? (
                <ResponsiveContainer width='100%' height={300}>
                    <BarChart
                        width={500}
                        height={400}
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeLinecap='1' vertical={false} stroke='#f2f2f2' />
                        <XAxis 
                        dataKey='name'
                        fontWeight={'bold'} 
                        tickLine={false} 
                        interval={0} 
                        tickMargin={10} 
                        tick={{ angle: -90, textAnchor: 'start', dy: 10 }} />
                        <YAxis
                            tick={{ dy: -5, dx: -40 }}
                            axisLine={false}
                            tickLine={false}
                            domain={['dataMin', 'dataMax']} 
                            tickCount={10} 
                            interval={0} 
                            allowDecimals={false}
                            fontWeight={'bold'} 
                        />
                        <Tooltip
                            contentStyle={{
                                fontSize: '14px',
                                padding: '10px',
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                            }}
                            itemStyle={{
                                padding: '5px 0',
                            }}
                            labelStyle={{
                                fontWeight: 'bold',
                                paddingBottom: '5px',
                            }}
                        />
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

export default PNChart;
