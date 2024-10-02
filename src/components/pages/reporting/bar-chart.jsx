import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReportingBarChart = ({ detail }) => {
    const [data, setData] = useState([]);

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
                                delay_end: innerValue?.delay_end,
                                delay_start: innerValue?.delay_start,
                                rush_end: innerValue?.rush_end,
                                rush_start: innerValue?.rush_start
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
                                fontSize: '14px', // Increase font size
                                padding: '10px', // Increase padding for a bigger tooltip box
                                backgroundColor: '#fff', // Background color
                                border: '1px solid #ccc', // Border style
                                borderRadius: '5px', // Rounded corners for the tooltip
                            }}
                            itemStyle={{
                                padding: '5px 0', // Adjust padding for each item
                            }}
                            labelStyle={{
                                fontWeight: 'bold', // Make the label bold
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

export default ReportingBarChart;
