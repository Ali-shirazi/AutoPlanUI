import React, { useEffect, useState, useRef } from 'react';
import { Autocomplete, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Axios from './../../../../configs/axios';
import medal from './../../../../assets/images/icons/Medal.svg';
import tools from '../../../../utils/tools';
import { CustomStyleWrapper } from '../custom.style';
import ReportingBarChart from '../bar-chart';
import DatePickerComponent from '../../../form-groups/date-picker';
import FormButton from '../../../form-groups/form-button';
import DetailDownloadBoxHeaderOnClick from '../../../template/detail-download-box-header-onclick';
import Tabledeviations from '../Tables/table-deviations';
import PNChart from '../positiveAndNegativeChart';
import BarChartForTime from '../barChartForTime';
import PNChartForTime from '../positiveAndNegativeChartForTime';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import TableForThirdCharts from '../Tables/tableForThirdCharts';
const ThirdChart = () => {
    const [deviationInMultiMonths, setDeviationInMultiMonths] = useState(null);
    const [loadingChart, setLoadingChart] = useState(true);
    const [usersList, setUsersList] = useState([]);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [persons, setPerson] = useState("");
    const printRef = useRef();

    const { handleSubmit, control, getValues } = useForm({
        defaultValues: {
            person: '',
            start: '',
            end: ''
        }
    });

    useEffect(() => {
        return () => {
            setLoadingChart(false);
        }
    }, []);

    const fetchData = (start = '', end = '', person = '') => {
        setLoadingChart(true);
        Axios.get(`${process.env.REACT_APP_BASE_URL}normaluser/amount-of-deviation/`, {
            params: {
                ...(start && { start: tools.changeTimeStampToDate(start) }),
                ...(end && { end: tools.changeTimeStampToDate(end) }),
                ...(person && { person })
            }
        })
            .then(res => {
                setDeviationInMultiMonths(res.data);
                setUsersList([]);
                Object.entries(res?.data)?.map(
                    ([title, value]) => title !== 'link' &&
                        Object.entries(value)?.map(([innerTitle]) =>
                            setUsersList(prev => [...prev, innerTitle])
                        )
                );
            })
            .catch(error => {
                console.error('Error fetching chart data:', error);
            })
            .finally(() => {
                setLoadingChart(false);
            });
    };

    const formSubmit = data => {
        setButtonLoader(false);
        const start = getValues('start');
        const end = getValues('end');
        const person = getValues('person');
        setPerson(person);
        fetchData(start, end, person);
        // console.log(deviationInMultiMonths,"ddddddddddddd");


    };

    const downloadReport = () => {
        const start = getValues('start');
        const end = getValues('end');
        const person = getValues('person');
        if (deviationInMultiMonths?.link) {
            Axios.get(`${process.env.REACT_APP_BASE_URL}${deviationInMultiMonths?.link}`, {
                params: {
                    ...(start && { start: tools.changeTimeStampToDate(start) }),
                    ...(end && { end: tools.changeTimeStampToDate(end) }),
                    ...(person && { person: person })
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
                title='گزارش میزان انحراف به تخصیص نفر (تعداد و زمان)'
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
                        <Controller
                            control={control}
                            name='end'
                            render={({ field: { onChange, value } }) => (
                                <DatePickerComponent value={value} onChange={onChange} title='تاریخ پایان' />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className='auto_complete_wrapper'>
                            <p className='auto_complete_title'>نام تعمیرکار</p>
                            <div className='auto_complete'>
                                <Controller
                                    control={control}
                                    name='person'
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            options={usersList}
                                            value={value}
                                            onChange={(event, newValue) => {
                                                onChange(newValue);
                                            }}
                                            sx={{ width: '100%' }}
                                            renderInput={params => <TextField {...params} />}
                                        />
                                    )}
                                />
                                <img src={medal} alt="Medal Icon" />
                            </div>
                        </div>
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
                        <FormButton
                            text='دریافت گزارش'
                            onClick={downloadReport}
                            type='button'
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
                            <div className='barchart_items no-print'>
                                <Typography variant='body1'>بر اساس تعداد :</Typography>
                                <div>
                                    <span className='first'></span>
                                    <p>تعجیل در پایان</p>
                                </div>
                                <div>
                                    <span className='second'></span>
                                    <p>تعجیل در شروع</p>
                                </div>
                                <div>
                                    <span className='third'></span>
                                    <p>تاخیر در شروع</p>
                                </div>
                                <div>
                                    <span className='foutrh'></span>
                                    <p>تاخیر در پایان</p>
                                </div>
                            </div>
                        </div>
                        <div className='mainChart' style={{ display: 'flex', flexDirection: "column" }}>
                            <ReportingBarChart detail={deviationInMultiMonths} />
                        </div>
                        <div className='barchart_header'>
                            <div className='barchart_items no-print'>
                                <Typography variant='body1'>بر اساس تعداد :</Typography>
                                <div>
                                    <span className='first'></span>
                                    <p>تعجیل در پایان</p>
                                </div>
                                <div>
                                    <span className='second'></span>
                                    <p>تعجیل در شروع</p>
                                </div>
                                <div>
                                    <span className='third'></span>
                                    <p>تاخیر در شروع</p>
                                </div>
                                <div>
                                    <span className='foutrh'></span>
                                    <p>تاخیر در پایان</p>
                                </div>
                            </div>
                        </div>
                        <div className='mainChart' style={{ display: 'flex', flexDirection: "column" }}>
                            <PNChart detail={deviationInMultiMonths} />
                        </div>
                        <div className='barchart_header'>
                            <div className='barchart_items no-print'>
                                <Typography variant='body1'>بر اساس زمان :</Typography>
                                <div>
                                    <span className='first'></span>
                                    <p>تعجیل در پایان</p>
                                </div>
                                <div>
                                    <span className='second'></span>
                                    <p>تعجیل در شروع</p>
                                </div>
                                <div>
                                    <span className='third'></span>
                                    <p>تاخیر در شروع</p>
                                </div>
                                <div>
                                    <span className='foutrh'></span>
                                    <p>تاخیر در پایان</p>
                                </div>
                            </div>
                        </div>
                        <div className='mainChart' style={{ display: 'flex', flexDirection: "column" }}>
                            <BarChartForTime detail={deviationInMultiMonths} />
                        </div>
                        <div className='barchart_header'>
                            <div className='barchart_items no-print'>
                                <Typography variant='body1'>بر اساس زمان :</Typography>
                                <div>
                                    <span className='first'></span>
                                    <p>تعجیل در پایان</p>
                                </div>
                                <div>
                                    <span className='second'></span>
                                    <p>تعجیل در شروع</p>
                                </div>
                                <div>
                                    <span className='third'></span>
                                    <p>تاخیر در شروع</p>
                                </div>
                                <div>
                                    <span className='foutrh'></span>
                                    <p>تاخیر در پایان</p>
                                </div>
                            </div>
                        </div>
                        <div className='mainChart' style={{ display: 'flex', flexDirection: "column" }}>
                            <PNChartForTime detail={deviationInMultiMonths} />
                        </div>
                        <div className='mainChart' style={{ display: 'flex', flexDirection: "column" }}>
                            <TableForThirdCharts detail={deviationInMultiMonths} />
                        </div>
                        <div className='mainChart' style={{ display: 'flex', flexDirection: "column" }}>
                            <Tabledeviations deviationInMultiMonths={deviationInMultiMonths} persons={persons} />
                        </div>

                    </div>
                </>
            )}
            

        </>
    );
};

export default ThirdChart;
