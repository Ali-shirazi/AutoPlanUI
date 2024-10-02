import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Axios from './../../../../configs/axios';
import { CustomStyleWrapper } from '../custom.style';
import ReportingLineChart from '../line-chart';
import DatePickerComponent from '../../../form-groups/date-picker';
import FormButton from '../../../form-groups/form-button';
import tools from '../../../../utils/tools';
import DetailDownloadBoxHeaderOnClick from '../../../template/detail-download-box-header-onclick';
import ReportingPieChart from '../pieChart';
import TableForCharts from '../Tables/tableForCharts';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

const FirstChart = () => {
    const colorsReporting = ['#1c1c1c', '#baedbd', '#c6c7f8', '#95a4fc'];
    const [reportingChartData, setReportingChartData] = useState(null);
    const [loadingChart, setLoadingChart] = useState(true);
    const [buttonLoader, setButtonLoader] = useState(false);
    const printRef = useRef();
    const { handleSubmit, control, getValues } = useForm({
        defaultValues: {
            start: '',
            end: ''
        }
    });

    useEffect(() => {
        // Initial fetch for the chart data
        return () => {
            setLoadingChart(false);
        }
    }, []);

    const fetchData = (start = '', end = '') => {
        setLoadingChart(true);
        Axios.get(`${process.env.REACT_APP_BASE_URL}normaluser/acceptance-report-in-one-month`, {
            params: {
                ...(start && { start: tools.changeTimeStampToDate(start) }),
                ...(end && { end: tools.changeTimeStampToDate(end) })
            }
        })
            .then(res => {
                setReportingChartData(res.data);
            })
            .catch(error => {
                console.error('Error fetching chart data:', error);
            })
            .finally(() => {
                setLoadingChart(false);
            });
    };

    const formSubmit = data => {
        const start = getValues('start');
        const end = getValues('end');
        setButtonLoader(true);
        fetchData(start, end);
        setButtonLoader(false);


    };
    const downloadReport = () => {
        const start = getValues('start');
        const end = getValues('end');
        if (reportingChartData?.link) {
            Axios.get(`${process.env.REACT_APP_BASE_URL}${reportingChartData.link}`, {
                params: {
                    ...(start && { start: tools.changeTimeStampToDate(start) }),
                    ...(end && { end: tools.changeTimeStampToDate(end) })
                }
            })
                .then(res => {
                    if (res?.data?.link) {
                        window.location.href = `${process.env.REACT_APP_BASE_URL}${res.data.link}`;
                    }
                })
                .catch(error => {
                    console.error('Error downloading report:', error);
                })
                .finally(() => {
                    setButtonLoader(false);
                });
        } else {
            setButtonLoader(false);
        }
    }

    // const downloadHandler = link => {
    //     if (link) {
    //         Axios.get(link, { baseURL: process.env.REACT_APP_BASE_URL })
    //             .then(res => {
    //                 if (res?.data?.link) {
    //                     window.location.href = `${process.env.REACT_APP_BASE_URL}${res.data.link}`;
    //                 }
    //             })
    //             .catch(error => {
    //                 console.error('Error in downloadHandler:', error);
    //             });
    //     }
    // };
    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
    };
    return (
        <>
            <DetailDownloadBoxHeaderOnClick
                title='گزارش پذیرش در ماه اخیر'
                buttonText='چاپ گزارشات'
                onClick={handlePrint}
                Icon={LocalPrintshopIcon}
            />
            <CustomStyleWrapper onSubmit={handleSubmit(formSubmit)}>
                <Grid container spacing={1.5}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            control={control}
                            name='start'
                            render={({ field: { onChange, value } }) => (
                                <DatePickerComponent value={value} onChange={onChange} title='تاریخ شروع' />
                            )}
                        />
                        <FormButton
                            onClick={downloadReport}
                            text='دریافت گزارش'
                            type='button'
                            backgroundColor={'#174787'}
                            color={'white'}
                            height={48}
                            loading={buttonLoader}
                            fontSize={'13px'}
                            margin={'35px 0 0 0'}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            control={control}
                            name='end'
                            render={({ field: { onChange, value } }) => (
                                <DatePickerComponent value={value} onChange={onChange} title='تاریخ پایان' />
                            )}
                        />
                        <FormButton
                            text='اعمال'
                            type='submit'
                            backgroundColor={'#174787'}
                            color={'white'}
                            height={48}
                            loading={buttonLoader}
                            fontSize={'13px'}
                            margin={'35px 0 0 0'}
                        />
                    </Grid>
                </Grid>
            </CustomStyleWrapper>
            {loadingChart ? (
                <div className='loading'>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <div ref={printRef}>
                        <div className='barchart_header'>
                            <div className='barchart_items'>
                                میزان پذیرش در ماه اخیر به تفکیک برای هر پست
                            </div>
                        </div>
                        <div className='mainChart' style={{ display: 'flex', flexDirection: "column", gap: "4rem" }}>
                            <ReportingLineChart detail={reportingChartData} />
                        </div>
                        <div className='mainChart' style={{ display: 'flex', flexDirection: "column", gap: "4rem" }}>
                            <TableForCharts hours={false} detail={reportingChartData} name={"گزارش پذیرش در ماه اخیر"} title={"میزان پذیرش (درصد و تعداد)"} />
                        </div>
                        <div className='mainChart' style={{ display: 'flex', flexDirection: "column", gap: "4rem" }}>
                            <ReportingPieChart hours={false} detail={reportingChartData} />
                        </div>
                    </div>
                </>
            )}


        </>
    );
};

export default FirstChart;
