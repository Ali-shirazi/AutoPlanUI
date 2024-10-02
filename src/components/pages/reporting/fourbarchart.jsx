import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FourBarChart = ({ detail }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (detail) {
            const chartData = Object.entries(detail)
                .filter(([key]) => key !== 'link') 
                .map(([key, value]) => ({
                    name: key,
                    delay_end: value?.delay_end,
                    delay_start: value?.delay_start,
                    rush_end: value?.rush_end,
                    rush_start: value?.rush_start
                }));
                console.log(chartData,"chart");
            setData(chartData);
        }
    }, [detail]);

    return (
        <>
            {data.length ? (
                <ResponsiveContainer width='100%' height={400}>
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeLinecap='1' vertical={false} stroke='#f2f2f2' />
                        <XAxis dataKey='name' tickLine={false} interval={0} hide />
                        <YAxis tickMargin={30} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey='delay_end' name='تاخیر در پایان' fill='#95A4FC' />
                        <Bar dataKey='delay_start' name='تاخیر در شروع' fill='#174787' />
                        <Bar dataKey='rush_end' name='تعجیل در پایان' fill='#E8E8E8' />
                        <Bar dataKey='rush_start' name='تعجیل در شروع' fill='#299D91' />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className='no_report'>گزارشی موجود نمیباشد</p>
            )}
        </>
    );
};

export default FourBarChart;
