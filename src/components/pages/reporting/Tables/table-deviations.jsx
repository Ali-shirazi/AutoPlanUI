import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Axios from './../../../../configs/axios';

export default function Tabledeviations({ deviationInMultiMonths, persons }) {
    // const [loadingChart, setLoadingChart] = useState(true);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [deviations, setDeviations] = useState();

    useEffect(() => {
        console.log(persons, "ddddddddddddddd1");

        if (deviationInMultiMonths && persons) {

            const data = deviationInMultiMonths;
            const keys = Object.keys(data).filter(k => k !== "link");
            const columnsData = [
                { field: 'id', headerName: 'شماره ردیف', width: 90, align: 'center', headerAlign: 'center' },
                // { field: 'month', headerName: 'ماه', width: 150, align: 'center', headerAlign: 'center' },
                { field: 'rush_start', headerName: 'تعجیل در شروع', width: 150, align: 'center', headerAlign: 'center' },
                { field: 'rush_end', headerName: 'تعجیل در پایان', width: 150, align: 'center', headerAlign: 'center' },
                { field: 'delay_start', headerName: 'تاخیر در شروع', width: 150, align: 'center', headerAlign: 'center' },
                { field: 'delay_end', headerName: 'تاخیر در پایان', width: 150, align: 'center', headerAlign: 'center' },
                { field: 'most_common_reason', headerName: 'علت انحراف', width: 150, align: 'center', headerAlign: 'center' },
                { field: 'most_common_reason_count', headerName: 'تعداد', width: 150, align: 'center', headerAlign: 'center' },

            ];

            setColumns(columnsData);
            const users = Object.entries(Object.values(deviationInMultiMonths)).map((user) => {
                return Object.values(Object.entries(user[1]))
            })
            const filtered = users.filter((user) => {
                return user.length < 45
            })
            const secondfiltered = filtered.filter(([items]) => {
                console.log(items, "ddddddddd5");
                // setDeviations([...deviations, items])
                return items[0] == persons
            })
            console.log(secondfiltered.length,"dddddddddsec");
            if (secondfiltered){
                // console.log(Object.fromEntries(...secondfiltered)[persons],"dddddddddsec");
                setDeviations(secondfiltered.length != 0 ? Object.fromEntries(...secondfiltered)[persons] : "");
                const rowsData = [
                    {
                        id: "1",
                        rush_start: secondfiltered.length != 0 ? Object.fromEntries(...secondfiltered)[persons].rush_start.toFixed(2) : "",
                        rush_end: secondfiltered.length != 0 ? Object.fromEntries(...secondfiltered)[persons].rush_end.toFixed(2) : "",
                        delay_start: secondfiltered.length != 0 ? Object.fromEntries(...secondfiltered)[persons].delay_start.toFixed(2) : "",
                        delay_end: secondfiltered.length != 0 ? Object.fromEntries(...secondfiltered)[persons].delay_end.toFixed(2) : "",
                        most_common_reason: secondfiltered.length != 0 ? Object.fromEntries(...secondfiltered)[persons].most_common_reason : "",
                        most_common_reason_count: secondfiltered.length != 0 ? Object.fromEntries(...secondfiltered)[persons].most_common_reason_count : ""
                    }];
                
    
                setRows(rowsData);
            }


            
        }
        // fetchData();
    }, [deviationInMultiMonths]);

    const fetchData = () => {
        // Axios.get(`${process.env.REACT_APP_BASE_URL}normaluser/deviation-in-six-months/`)
        //     .then(res => {
        //         const data = res.data;
        //         const keys = Object.keys(data).filter(k => k !== "link");
        //         const rowsData = keys.map((key, index) => {
        //             return {
        //                 id: index + 1,
        //                 month: key,
        //                 rush_start: data[key].rush_start.toFixed(2),
        //                 rush_end: data[key].rush_end.toFixed(2),
        //                 delay_start: data[key].delay_start.toFixed(2),
        //                 delay_end: data[key].delay_end.toFixed(2)
        //             };
        //         });

        //         setRows(rowsData);

        //         const columnsData = [
        //             { field: 'id', headerName: 'شماره ردیف', width: 90, align: 'center', headerAlign: 'center' },
        //             { field: 'month', headerName: 'ماه', width: 150, align: 'center', headerAlign: 'center' },
        //             { field: 'rush_start', headerName: 'تعجیل در شروع', width: 150, align: 'center', headerAlign: 'center' },
        //             { field: 'rush_end', headerName: 'تعجیل در پایان', width: 150, align: 'center', headerAlign: 'center' },
        //             { field: 'delay_start', headerName: 'تاخیر در شروع', width: 150, align: 'center', headerAlign: 'center' },
        //             { field: 'delay_end', headerName: 'تاخیر در پایان', width: 150, align: 'center', headerAlign: 'center' }
        //         ];

        //         setColumns(columnsData);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching chart data:', error);
        //     })
        //     .finally(() => {
        //         setLoadingChart(false);
        //     });
    };

    return (
        <Box sx={{ height: 450, width: '100%', direction: "rtl" }}>
            <Typography variant="body2" margin={2} component="p" color="ActiveBorder">
                بیشترین انحرافات ثبت شده برای {persons}
            </Typography>
            <DataGrid
                sx={{ direction: "rtl" }}
                rows={rows}
                columns={columns}
                pagination={false}
                hideFooterPagination
                autoHeight
                // loading={loadingChart}
                disableSelectionOnClick
            />
        </Box>
    );
}
