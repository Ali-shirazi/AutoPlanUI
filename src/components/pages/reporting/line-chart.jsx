import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ComposedChart, LabelList } from 'recharts';

const ReportingLineChart = ({ detail }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (detail) {
            const numData = Object.entries(detail)
                .filter(([title]) => title !== 'link' && title.includes('تعداد'))
                .map(([title, value]) => ({
                    name: title,
                    value: value
                }));
            setData(numData);
        }
    }, [detail]);

    const hasValue = data.every(item => item.value === 0);
    const formatNumber = value => `${value}`;

    return (
        <>
            {hasValue ? (
                <p className='no_report'>گزارشی موجود نمیباشد</p>
            ) : (
                <div className="line-chart-wrapper">  {/* You can keep your styled component or use a div */}
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={data}>
                            <CartesianGrid strokeLinecap="1" vertical={false} stroke="#f2f2f2" />
                            <XAxis
                                height={60}
                                dataKey="name"
                                fontWeight="bold"
                                interval={0}
                                tickMargin={10}
                                tick={{ angle: -90, textAnchor: 'start', dy: 10 }}
                            />
                            <YAxis
                                tick={{ dy: -5, dx: -40 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 'auto']}
                                tickCount={5}
                                tickFormatter={formatNumber}
                            />
                            <Tooltip contentStyle={{ color: "#000" }} itemStyle={{ color: '#000' }} />
                            <Bar dataKey="value" name="تعداد" fill="#A8C5DA" barSize={20}>
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    formatter={formatNumber}
                                    fill="#000"
                                    fontSize={14}
                                />
                            </Bar>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}
        </>
    );
};

export default ReportingLineChart;
    