// TableForThirdCharts
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function TableForCharts({ detail, name, title }) {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    // Function to parse time strings like "Xh Ym"
    const parseTimeString = (timeStr) => {
        if (!timeStr) return 0;  // Return 0 if the time string is null or undefined

        const regex = /(\d+)h (\d+)m/;
        const match = timeStr.match(regex);

        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            return hours * 60 + minutes;
        } else {
            console.warn(`Invalid time string: ${timeStr}`);
            return 0;  // Return 0 for invalid format
        }
    };

    // Function to format minutes back into "Xh Ym" format
    const formatTime = (minutes) => {
        if (isNaN(minutes)) return '0h 0m';  // Handle NaN values gracefully

        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    useEffect(() => {
        if (detail) {
            const columnsData = [
                { field: 'name', headerName: 'پست', flex: 1, align: 'right', headerAlign: 'left' },
                { field: 'delay_end', headerName: 'تاخیر در پایان', flex: 1, align: 'right', headerAlign: 'left' },
                { field: 'delay_start', headerName: 'تاخیر در شروع', flex: 1, align: 'right', headerAlign: 'left' },
                { field: 'rush_end', headerName: 'تعجیل در پایان', flex: 1, align: 'right', headerAlign: 'left' },
                { field: 'rush_start', headerName: 'تعجیل در شروع', flex: 1, align: 'right', headerAlign: 'left' },
            ];
            setColumns(columnsData);

            const rowsData = Object.entries(detail)
                .filter(([key]) => key !== 'link')
                .flatMap(([key, value], index) =>
                    Object.entries(value).map(([innerTitle, innerValue]) => {
                        // Log the values being processed
                        console.log(`Processing ${innerTitle}:`, innerValue);

                        return {
                            id: `${index + 1}-${innerTitle}`,
                            name: innerTitle,
                            delay_end: innerValue?.delay_end_time,
                            delay_start: innerValue?.delay_start_time,
                            rush_end: innerValue?.rush_end_time,
                            rush_start: innerValue?.rush_start_time,
                        };
                    })
                );

            setRows(rowsData);
        }
    }, [detail]);

    return (
        <Box sx={{ width: '100%', direction: 'rtl', marginY: '7rem' }}>
            <Typography variant='body2' margin={2} component='p' color='textSecondary'>
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
