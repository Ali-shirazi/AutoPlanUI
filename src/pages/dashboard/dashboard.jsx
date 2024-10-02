import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid, Grow } from '@mui/material';
import Axios from '../../configs/axios';
import { useSelector } from 'react-redux';

//Assets
import { HomeWrapper } from './dashboard.style';

//Components
import DetailDownloadBoxHeader from '../../components/template/detail-download-box-header';
import DetailBoxHeader from '../../components/template/detail-box-header';
import ChartItem from '../../components/pages/reporting/chart-item';
import ReportingChart from '../../components/template/reporting-chart';
import HomeTable from '../../components/pages/home/home-table';
import PagesHeader from '../../components/template/pages-header';

// Tools
import PERMISSION from '../../utils/permission.ts';
import NotAccessField from '../../components/template/not-access';

const Home = () => {
    const colorsReporting = ['#468585', '#3795BD', '#E68369', '#405D72', '#DCA47C', '#3FA2F6', "#FFC7ED", "#E90074", "#088395", "#4C3BCF", "#91DDCF", "#06D001", "#83B4FF", "#AF47D2", "#850F8D", "#01204E", "#8E3E63", "#C3FF93", "#CDE8E5", "#C40C0C", "#FFC100", "#4F6F52", "#F3D0D7", "#A79277", "#481E14", "#F2613F"];
    const userPermissions = useSelector(state => state.User.info.permission);
    const [managementList, setManagementList] = useState([]);
    const [reportingChartData, setReportingChartData] = useState();
    const [loading, setLoading] = useState({
        reportingChartDataLoading: true,
        tableLoading: true
    });
    const [grow, setGrow] = useState(true);
    useEffect(() => {
        () => { setGrow(false); }
    }, [])

    useEffect(() => {
        // console.log(userPermissions,"perrrrrrrr");
        if (userPermissions.length) {
            if (userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.LIST)) {
                Axios.get('normaluser/dashboard-diagram/')
                    .then(res => {
                        // console.log(res?.data?.result, "dashhh23");
                        setManagementList(() =>
                            [res?.data?.result].map(item => ({
                                fixed_vehicle_percent: item?.fixed_vehicle_percent || '---',
                                in_process_vehicle_percent: item?.in_process_vehicle_percent || '---',
                                fixed_vehicle_count: item?.fixed_vehicle_count || '---',
                                in_process_vehicle_count: item?.in_process_vehicle_count || '---',
                                // license: `${item?.plaque_4} ${item?.plaque_3} ${item?.plaque_2} ${item?.plaque_1}`,
                                stopped_in2days: item?.stopped_in2days || '---',
                                stopped_in7days: item?.stopped_in7days || '---',
                                stopped_morethan7days: item?.stopped_morethan7days || '---',
                                stopped_vehicle_percent: item?.stopped_vehicle_percent || '---',
                                stopped_vehicle_count: item?.stopped_vehicle_count || '---',
                            }))
                        );
                    })
                    .catch(() => { })
                    .finally(() => {
                        // console.log(managementList, "dashhhhhhhhhh");
                        setLoading(prev => ({
                            ...prev,
                            tableLoading: false
                        }));
                    });
            } else {
                setLoading({
                    ...loading,
                    tableLoading: false
                });
            }

            if (userPermissions.includes(PERMISSION.EXCEL.LIST)) {
                Axios.get('normaluser/acceptance-report-in-one-month/')
                    .then(res => {
                        // console.log(res.data, "Dataa");
                        setReportingChartData(res.data);
                    })
                    .catch(() => { })
                    .finally(() => {
                        setLoading(prev => ({
                            ...prev,
                            reportingChartDataLoading: false
                        }));
                    });
            } else {
                setLoading({
                    ...loading,
                    reportingChartDataLoading: false
                });
            }
        }
    }, [userPermissions]);

    return (
        <>
            <PagesHeader buttonTitle='نام نمایندگی : فلان' />
            <HomeWrapper>
                <Grid container columnSpacing={1.5} rowSpacing={1.5}>
                    <Grow in={grow} style={{ transitionDelay: "500ms" }}>
                        <Grid item xs={6} xl={6} top={1.5}>
                            <div className='itemMore'>
                                <DetailBoxHeader title='تنظیمات سایت' buttonText='مشاهده' link='/setting' />
                            </div>
                        </Grid>
                    </Grow>
                    <Grow in={grow} style={{ transitionDelay: "500ms" }}>
                        <Grid item xs={6} xl={6} top={1.5}>
                            <div className='itemMore'>
                                <DetailBoxHeader title='اقدام اصلاحی' buttonText='مشاهده' link='/corrective' />
                            </div>
                        </Grid>
                    </Grow>
                    <Grow in={grow} style={{ transitionDelay: "1000ms" }}>
                        <Grid item xs={12}>
                            <div className='item'>
                                <DetailDownloadBoxHeader
                                    title='گزارش پذیرش در ماه اخیر'
                                />
                                {!userPermissions.includes(PERMISSION.EXCEL.LIST) && userPermissions.length ? (
                                    <NotAccessField />
                                ) : loading.reportingChartDataLoading ? (
                                    <div className='loading'>
                                        <CircularProgress />
                                    </div>
                                ) : (
                                    <div className='chartWrapper'>
                                        <div className='chartItems'>
                                            {reportingChartData &&
                                                Object.entries(reportingChartData)?.map(
                                                    ([title, percent], index) =>
                                                        title !== 'link' && (
                                                            <ChartItem
                                                                key={title}
                                                                title={title}
                                                                percent={percent.toFixed(1)}
                                                                color={colorsReporting[index]}
                                                            />
                                                        )
                                                )}
                                        </div>
                                        <div className='mainChart'>
                                            <ReportingChart detail={reportingChartData} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Grid>
                    </Grow>
                    <Grow in={grow} style={{ transitionDelay: "1500ms" }}>
                        <Grid item xs={6} top={1.5}>
                            <div className='itemMore'>
                                <DetailBoxHeader title='کسری قطعات انبار' buttonText='مشاهده' link='/deficiency' />
                            </div>
                        </Grid>
                    </Grow>
                    <Grow in={grow} style={{ transitionDelay: "1500ms" }}>
                        <Grid item xs={6} top={1.5}>
                            <div className='itemMore'>
                                <DetailBoxHeader title='ظرفیت سنجی' buttonText='مشاهده' link='/qualification' />
                            </div>
                        </Grid>
                    </Grow>
                    <Grow in={grow} style={{ transitionDelay: "2000ms" }}>
                        <Grid item xs={12} top={1.5}>
                            <div className='item'>
                                <DetailBoxHeader title='مدیریت برنامه ریزی تعمیرات' buttonText='مدیریت تعمیرات' link='/planning' />
                                {!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.LIST) && userPermissions.length ? (
                                    <NotAccessField />
                                ) : loading.tableLoading ? (
                                    <div className='loading'>
                                        <CircularProgress />
                                    </div>
                                ) : (
                                    <HomeTable data={managementList} />
                                )}
                            </div>
                        </Grid>
                    </Grow>
                </Grid>
            </HomeWrapper>
        </>
    );
};

export default Home;
