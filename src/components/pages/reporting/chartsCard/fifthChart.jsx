import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CircularProgress, Grid, Autocomplete, TextField } from '@mui/material';
import tools from '../../../../utils/tools';
import Axios from './../../../../configs/axios';
import { CustomStyleWrapper } from '../custom.style';
import medal from './../../../../assets/images/icons/Medal.svg';
import DatePickerComponent from '../../../form-groups/date-picker';
import FormButton from '../../../form-groups/form-button';
import { OptionsWrapper } from './chartsCard.style';
import DetailDownloadBoxHeaderOnClick from '../../../template/detail-download-box-header-onclick';
import ReportingPieChartFifth from '../pieChartFifth';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

const FifthChart = () => {
    const [reportingChartData, setReportingChartData] = useState();
    const [loadingChart, setLoadingChart] = useState(true);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [reload, setReload] = useState(false);
    const [dayFilter, setDayFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [positions, setPositions] = useState([]);
    const printRef = useRef();

    const { handleSubmit, control, getValues, reset } = useForm({
        defaultValues: {
            start: '',
            end: '',
            person: '',
            position: ''
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoadingChart(true);
            const startTime = getValues('start');
            const endTime = getValues('end');
            const person = getValues('person');

            if (startTime && endTime && person) {
                const selectedPosition = positions.find(p => p.id === person)?.title;

                try {
                    const res = await Axios.get(`${process.env.REACT_APP_BASE_URL}normaluser/total-times/`, {
                        params: {
                            ...(startTime && { start: tools.changeTimeStampToDate(startTime) }),
                            ...(endTime && { end: tools.changeTimeStampToDate(endTime) }),
                            ...(dayFilter && { day: dayFilter }),
                            ...(monthFilter && { month: monthFilter }),
                            ...(yearFilter && { year: yearFilter }),
                            // ...(person && { person: person }),
                            ...(selectedPosition && { organ_position: selectedPosition })
                        }
                    });
                    console.log(res.data.result, "chartreport");
                    setReportingChartData(res.data.result);
                    setDayFilter('');
                    setMonthFilter('');
                    setYearFilter('');
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoadingChart(false);
                }
            } else {
                setLoadingChart(false);
            }
        };

        fetchData();
    }, [reload]);

    useEffect(() => {
        const fetchPositions = async () => {
            setLoadingChart(true);

            try {
                const res = await Axios.get(`${process.env.REACT_APP_BASE_URL}normaluser/organizational-position/list_create/`);
                setPositions(res.data.results.map(r => ({ title: r.title, id: r.id })));
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingChart(false);
            }
        };

        fetchPositions();
    }, []);

    const formSubmit = data => {
        setButtonLoader(false);
        setReload(prev => !prev);
    };

    const downloadReport = async () => {
        setButtonLoader(true);
        const startTime = getValues('start');
        const endTime = getValues('end');
        const person = getValues('person');
        const selectedPosition = positions.find(p => p.id === person)?.title;

        const params = {
            ...(startTime && { start: tools.changeTimeStampToDate(startTime) }),
            ...(endTime && { end: tools.changeTimeStampToDate(endTime) }),
            ...(selectedPosition && { organ_position: selectedPosition })
        };

        try {
            const res = await Axios.get(`${process.env.REACT_APP_BASE_URL}normaluser/export-section-time-to-excel`, { params });
            window.location.href = `${process.env.REACT_APP_BASE_URL}${res.data?.result}`;
        } catch (error) {
            console.error('Download report error:', error);
        } finally {
            setButtonLoader(false);
        }
    };

    // const downloadHandler = async link => {
    //     try {
    //         const res = await Axios.get(link, { baseURL: process.env.REACT_APP_BASE_URL });
    //         if (res?.data?.link) {
    //             location.href = `${process.env.REACT_APP_BASE_URL}${res.data?.link}`;
    //         }
    //     } catch (error) {
    //         console.error(error);
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
            <div ref={printRef}>
                <DetailDownloadBoxHeaderOnClick
                    title='گزارش ظرفیت به ازای هر پست'
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
                                render={({ field: { onChange, value } }) => {
                                    return <DatePickerComponent value={value} onChange={onChange} title='تاریخ شروع' />;
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                control={control}
                                name='end'
                                render={({ field: { onChange, value } }) => {
                                    return <DatePickerComponent value={value} onChange={onChange} title='تاریخ پایان' />;
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className='auto_complete_wrapper'>
                                <p className='auto_complete_title'>نام پست / دپارتمان</p>
                                <div className='auto_complete'>
                                    <Controller
                                        control={control}
                                        name='person'
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <Autocomplete
                                                    options={positions}
                                                    getOptionLabel={(option) => option.title}
                                                    value={positions.find(p => p.id === value) || null}
                                                    onChange={(event, newValue) => {
                                                        onChange(newValue ? newValue.id : null);
                                                    }}
                                                    sx={{ width: '100%' }}
                                                    renderInput={params => <TextField {...params} />}
                                                />
                                            );
                                        }}
                                    />
                                    <img src={medal} />
                                </div>
                            </div>
                            <FormButton
                                text='دریافت گزارش'
                                type='button'
                                onClick={downloadReport}
                                backgroundColor={'#174787'}
                                color={'white'}
                                height={48}
                                loading={buttonLoader}
                                fontSize={'13px'}
                                margin={'35px 0 0 0'}
                            />
                        </Grid>
                        <Grid item xs={6}>
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
                    <OptionsWrapper>
                        <div className='fields'>
                            <div className='field'>
                                <p>ظرفیت کل</p>
                                <div className='circle'>
                                    {reportingChartData?.total_times_capacity_minute} : {reportingChartData?.total_times_capacity_hour}
                                </div>
                                <p>مدت زمان برنامه ریزی </p>
                                <div className='circle'>
                                    {reportingChartData?.total_working_time_minute} : {reportingChartData?.total_working_time_hour}
                                </div>
                                <p>اجرای واقعی</p>
                                <div className='circle'>
                                    {reportingChartData?.total_exact_planning_time_minute} : {reportingChartData?.total_exact_planning_time_hour}
                                </div>
                            </div>

                        </div>
                        <ReportingPieChartFifth detail={reportingChartData} />
                    </OptionsWrapper>
                )}

                
            </div>
        </>
    );
};

export default FifthChart;
