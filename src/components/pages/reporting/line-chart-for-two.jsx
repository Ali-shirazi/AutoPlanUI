import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ComposedChart, LabelList } from 'recharts';

// Assets
import { LineChartWrapper } from './line-chart.style';

const LinechartForTwo = ({ detail }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (detail) {
            const chartData = Object.entries(detail)
                .filter(([title]) => title !== 'link' && title != 'total_time')
                .map(([title, value]) => {
                    const hours = Math.floor(value / 60);
                    const minutes = value % 60;
                    return {
                        name: `${title}`,
                        value: value, // Keep the original minutes value for Y-axis
                        formattedValue: `${hours}h ${minutes}m`
                    };
                });

            setData(chartData);
        }
    }, [detail]);

    const hasValue = data.every(item => item.value === 0);

    return (
        <>
            {hasValue ? (
                <p className='no_report'>گزارشی موجود نمیباشد</p>
            ) : (
                <LineChartWrapper>
                    <ResponsiveContainer width={'100%'} height={400}>
                        <ComposedChart data={data}>
                            <CartesianGrid strokeLinecap='1' vertical={false} stroke='#f2f2f2' />
                            <XAxis
                                height={60}
                                dataKey='name'
                                fontWeight={'bold'}
                                interval={0}
                                tickMargin={10}
                                tick={{ angle: -90, textAnchor: 'start', dy: 10 }}
                            />
                            <YAxis
                                tick={{ dy: -5, dx: -40 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, Math.max(...data.map(item => item.value))]}
                                tickCount={5}
                                tickFormatter={value => `${Math.floor(value / 60)}h ${value % 60}m`}
                            />
                            <Tooltip formatter={(value) => `${Math.floor(value / 60)}h ${value % 60}m`} contentStyle={{ color: "#000" }} itemStyle={{ color: '#000' }} />
                            <Bar dataKey='value' name='مدت زمان' fill='#A8C5DA' barSize={20}>
                                <LabelList
                                    dataKey='formattedValue'
                                    position='top'
                                    fill="#000"
                                    fontSize={14}
                                />
                            </Bar>
                        </ComposedChart>
                    </ResponsiveContainer>
                </LineChartWrapper>
            )}
        </>
    );
};

export default LinechartForTwo;
