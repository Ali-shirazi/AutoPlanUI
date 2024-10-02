import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts';

const ReportingChart = ({ detail }) => {
    const [data, setData] = useState([]);

    const backupData = [
        { name: 'بدون اطلاعات', value: 20 },
        { name: 'بدون اطلاعات', value: 40 },
        { name: 'بدون اطلاعات', value: 30 }
    ];

    useEffect(() => {
        if (detail) {
            const filteredData = Object.entries(detail)
                .filter(([title]) => title !== 'link' && !title.includes("تعداد"))
                .map(([title, percent]) => ({ name: title, value: parseFloat(percent).toFixed(1) }));
            setData(filteredData);
        }
    }, [detail]);

    const colors = ['#468585', '#3795BD', '#E68369', '#405D72', '#DCA47C', '#3FA2F6', "#FFC7ED", "#E90074", "#088395", "#4C3BCF", "#91DDCF", "#06D001", "#83B4FF", "#AF47D2", "#850F8D", "#01204E", "#8E3E63", "#C3FF93", "#CDE8E5", "#C40C0C", "#FFC100", "#4F6F52", "#F3D0D7", "#A79277", "#481E14", "#F2613F"];
    const formatNumber = value => {
        const numberValue = parseFloat(value); 
        return !isNaN(numberValue) ? `${numberValue.toFixed(1)} %` : "0%";
    };
    

    return (
        <BarChart width={700} height={400} data={data.length ? data : backupData}>
            <XAxis
                dataKey="name"
                fontWeight={'bold'}
                interval={0}
                tickMargin={10}
                tick={{ angle: -90, textAnchor: 'start', dy: 10 }}
            />
            <YAxis
                tickMargin={10}
                tick={{ dy: -5, dx: -40 }}
                domain={[0, 100]}
                tickCount={5}
                tickFormatter={(tick) => `${tick}%`}
            />
            <Tooltip
                formatter={(value) => `${value} %`} // Tooltip value formatting
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
            <Bar dataKey="value" name='درصد' fill="#8884d8" barSize={20}>
                <LabelList
                    dataKey="value"
                    position="top"
                    formatter={formatNumber}
                    fill="#000" 
                    fontSize={12}  
                />
                {(data.length ? data : backupData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
            </Bar>
        </BarChart>
    );
};

export default ReportingChart;
