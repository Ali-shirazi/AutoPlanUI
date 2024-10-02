import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Axios from './../../../../configs/axios';
import tools from '../../../../utils/tools';
import { CustomStyleWrapper } from '../custom.style';
import FourBarChart from '../fourbarchart';
import FormButton from '../../../form-groups/form-button';
import DetailDownloadBoxHeaderOnClick from '../../../template/detail-download-box-header-onclick';
import Reporttable from '../Tables/table';
import PiechartForSixMonth from '../piechartForSixMonth';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

const FourthChart = () => {
    const [deviationInSixMonths, setDeviationInSixMonths] = useState(null);
    const [link, setLink] = useState();
    const [loadingChart, setLoadingChart] = useState(true);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [reload, setReload] = useState(false);
    const printRef = useRef();

    const { handleSubmit, control } = useForm({
        defaultValues: {
            start: '',
            end: ''
        }
    });

    useEffect(() => {
        fetchData();
    }, [reload]);

    const fetchData = () => {
        setLoadingChart(true);
        Axios.get(`${process.env.REACT_APP_BASE_URL}normaluser/deviation-in-six-months/`)
            .then(res => {
                setDeviationInSixMonths(res.data);
            })
            .catch(error => {
                console.error('Error fetching chart data:', error);
            })
            .finally(() => {
                setLoadingChart(false);
            });

        Axios.get(`${process.env.REACT_APP_BASE_URL}normaluser/export-deviations-with-detail-to-excel/`).then(res => {
            setLink(res?.data?.link);
        }).catch(error => {
            console.error('Error fetching chart link:', error);
        });
    };

    const downloadHandler = link => {
        if (link) {
            const token = localStorage.getItem('AutoPlaningToken'); // Assuming your token is stored in localStorage
    
            Axios.get("normaluser/export-deviations-with-detail-to-excel/", {
                baseURL: process.env.REACT_APP_BASE_URL,
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the Authorization header
                }
            })
            .then(res => {
                console.log(res,"excel");
                window.location.href = `${process.env.REACT_APP_BASE_URL}${res?.data?.link}`;
            })
            .catch(error => {
                console.error('Error in downloadHandler:', error);
            });
        }
    };
    

    const formSubmit = () => {
        setButtonLoader(true);
        setReload(prev => !prev);
        setButtonLoader(false);
        fetchData();
    };
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
                title='میزان بروز انحراف در شش ماه گذشته'
                buttonText='چاپ گزارشات'
                onClick={handlePrint}
                Icon={LocalPrintshopIcon}
            />
            <CustomStyleWrapper onSubmit={handleSubmit(formSubmit)}>
                <Grid container spacing={1.5}>
                    <Grid item xs={12} md={6}>
                        {/* Uncomment if DatePickerComponent is needed */}
                        {/* <Controller
                            control={control}
                            name='start'
                            render={({ field: { onChange, value } }) => (
                                <DatePickerComponent value={value} onChange={onChange} title='تاریخ شروع' />
                            )}
                        /> */}
                        <FormButton
                            text='دریافت فایل اکسل'
                            type='button'
                            backgroundColor={'#174787'}
                            color={'white'}
                            height={48}
                            onClick={() => downloadHandler(link)}
                            loading={buttonLoader}
                            fontSize={'13px'}
                            margin={'35px 0 0 0'}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {/* Uncomment if DatePickerComponent is needed */}
                        {/* <Controller
                            control={control}
                            name='end'
                            render={({ field: { onChange, value } }) => (
                                <DatePickerComponent value={value} onChange={onChange} title='تاریخ پایان' />
                            )}
                        /> */}
                        <FormButton
                            text='نمایش'
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
            <div className='mainChart'>
                {loadingChart ? (
                    <div className='loading'>
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <div ref={printRef}>
                            <FourBarChart detail={deviationInSixMonths} />
                            <Reporttable />
                            <PiechartForSixMonth detail={deviationInSixMonths} />
                        </div>
                    </>
                )}
            </div>

        </>
    );
};

export default FourthChart;
