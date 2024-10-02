import React from 'react';

//Assets

//Components
import { TableWrapper } from './home-table.style';

const  HomeTable = ({ data }) => {
    return (
        <TableWrapper>
            <table>
                <thead>
                    <tr>
                        <th>ردیف</th>
                        <th>خودروهای تعمیر شده</th>
                        <th>خودروهای در حال تعمیر</th>
                        <th>تاخیر تا 2 روز</th>
                        <th>تاخیر تا 7 روز</th>
                        <th>تاخیر بیش از 7 روز</th>
                        <th>توقف تعمیر</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index+1}>
                            <td>{index + 1}</td>
                            <td>({item.fixed_vehicle_percent}%) - {item.fixed_vehicle_count}</td>
                            <td>({item.in_process_vehicle_percent}%) - {item.in_process_vehicle_count}</td>
                            <td>{item.stopped_in2days}</td>
                            <td>{item.stopped_in7days}</td>
                            <td>{item.stopped_morethan7days}</td>
                            <td>({item.stopped_vehicle_percent}%) - {item.stopped_vehicle_count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableWrapper>
    );
};

export default HomeTable;
