import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function TableForCharts({ detail, name, title, hours }) {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        if (detail) {
            // Define columns with just two fields: "name" and "value"
            const columnsData = [
                {
                    field: 'name',
                    headerName: 'پست',
                    flex: 1,
                    align: 'right',
                    headerAlign: 'left',
                },
                {
                    field: 'value',
                    headerName: title,
                    flex: 1,
                    align: 'right',
                    headerAlign: 'left'
                }
            ];

            // Generate rows based on the data
            const rowsData = Object.entries(detail)
                .filter(([key]) => key !== 'link' && key !== 'total_time')
                .map(([key, value], index) => {
                    // If key includes "تعداد", leave value as is
                    const formattedValue = key.includes('تعداد')
                        ? value
                        : hours
                            ? `${Math.floor(value / 60)}h ${value % 60}m`
                            : `${parseFloat(value.toFixed(1))}%`; // Append % if not "تعداد"

                    return {
                        id: index + 1,
                        name: key,
                        value: formattedValue
                    };
                });

            setColumns(columnsData);
            setRows(rowsData);
        }
    }, [detail, hours, title]);

    return (
        <Box sx={{ width: '100%', direction: "rtl", marginY: "7rem" }}>
            <Typography variant="body2" margin={2} component="p" color="textSecondary">
                {name}
            </Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                pagination={false}
                hideFooterPagination
                autoHeight
                disableSelectionOnClick
                hideFooter
            />
        </Box>
    );
}
