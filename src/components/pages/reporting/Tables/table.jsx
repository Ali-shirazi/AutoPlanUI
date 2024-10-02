import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Axios from './../../../../configs/axios';

export default function Reporttable() {
    const [loadingChart, setLoadingChart] = useState(true);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        Axios.get(`${process.env.REACT_APP_BASE_URL}normaluser/deviation-in-six-months/`)
            .then(res => {
                const data = res.data;
                const keys = Object.keys(data).filter(k => k !== "link");
                const rowsData = keys.map((key, index) => {
                    return {
                        id: index + 1,
                        month: key,
                        rush_start: data[key].rush_start,
                        rush_end: data[key].rush_end,
                        delay_start: data[key].delay_start,
                        delay_end: data[key].delay_end
                    };
                });

                setRows(rowsData);

                const columnsData = [
                    { field: 'id', headerName: 'شماره ردیف', width: 90, align: 'center', headerAlign: 'center' },
                    { field: 'month', headerName: 'ماه', width: 150, align: 'center', headerAlign: 'center' },
                    { field: 'rush_start', headerName: 'تعجیل در شروع', width: 150, align: 'center', headerAlign: 'center' },
                    { field: 'rush_end', headerName: 'تعجیل در پایان', width: 150, align: 'center', headerAlign: 'center' },
                    { field: 'delay_start', headerName: 'تاخیر در شروع', width: 150, align: 'center', headerAlign: 'center' },
                    { field: 'delay_end', headerName: 'تاخیر در پایان', width: 150, align: 'center', headerAlign: 'center' }
                ];

                setColumns(columnsData);
            })
            .catch(error => {
                console.error('Error fetching chart data:', error);
            })
            .finally(() => {
                setLoadingChart(false);
            });
    };

    return (
        <Box sx={{ height: 450, width: '100%', direction: "rtl" }}>
            <Typography variant="body2" margin={2} component="p" color="ActiveBorder">
                میزان بروز انحراف در شش ماه گذشته
            </Typography>
            <DataGrid
                sx={{ direction: "rtl" }}
                rows={rows}
                columns={columns}
                pagination={false}
                hideFooterPagination
                autoHeight
                loading={loadingChart}
                disableSelectionOnClick
            />
        </Box>
    );
}
