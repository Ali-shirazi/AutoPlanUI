/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { Autocomplete, CircularProgress, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Axios from '../../../configs/axios';
import { useSelector } from 'react-redux';
import PERMISSION from '../../../utils/permission.ts';

//Assets
import Arrow from './../../../assets/images/global/arrow.svg';
import UserHandUp from './../../../assets/images/icons/UserHandUp.svg';
import clockDot from './../../../assets/images/icons/clockDot.svg';

//Components
import FormButton from '../../form-groups/form-button';
import InputComponent from '../../form-groups/input-component';
import TimePicker from '../../form-groups/time-picker';
import DatePickerComponent from '../../form-groups/date-picker';
import { MenuItem, Select } from '@mui/material';

import Tools from '../../../utils/tools';
import tools from '../../../utils/tools';

const Time = ({
    Step1Id,
    Step2Id,
    modalFormStatus,
    chosenEditItemDetails,
    setStep,
    setReload,
    setIsModalOpen,
    setConfirmModalStatus,
    setDeflection,
    isworker
}) => {
    const userPermissions = useSelector(state => state.User.info.permission);
    const userInfo = useSelector(state => state.User.info);

    const [dataLoading, setDataLoading] = useState(true);
    const [deviationList, setDeviationList] = useState([]);
    const [reasonValue, setReasonValue] = useState();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState([]);
    const [whichDiagnosis, setWhichDiagnosis] = useState();
    const [diagnosisData, setDiagnosisData] = useState({
        "vehicle_specification": null,
        "exact_start_time": null,
        "exact_end_time": null,
        "the_reason_for_the_deviation": null,
        "delayed_start": null,
        "start_with_haste": null,
        "delayed_end": null,
        "end_with_haste": null
    });
    const [showSummary, setShowSummary] = useState(false);
    const [summaryData, setSummaryData] = useState();
    const havePermission = modalFormStatus === 'edit' ? userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_TIME) : true;

    const { register, handleSubmit, control, formState, setValue } = useForm({
        defaultValues: {
            proximate_start_date: '',
            proximate_start_hour: '',
            proximate_start_min: '',
            proximate_finish_date: '',
            proximate_finish_hour: '',
            proximate_finish_min: '',
            real_start_date: '',
            real_start_hour: '',
            real_start_min: '',
            real_finish_date: '',
            real_finish_hour: '',
            real_finish_min: ''
        },
        mode: 'onTouched'
    });

    const { errors } = formState;

    // console.log(chosenEditItemDetails,"chosenEditItemDetails");
    const getDiagnosis = async () => {
        await Axios.get('normaluser/diagnosis/list_create/?vehicle_specification_id=' + chosenEditItemDetails?.id)
            .then(res => {
                setDiagnosis(res.data?.results);
                console.log("diagnosis", res.data?.results);
                if (res.data.results.length > 0) {
                    setWhichDiagnosis(res.data.results[0].id);
                }
            })
    }

    useEffect(() => {
        console.log(Step1Id, Step2Id, "wwwww");
        getDiagnosis();

        Axios.get('normaluser/reason-for-deviation/list_create/')
            .then(res => {
                let posts = res.data.results.map(item => ({
                    label: item.reason,
                    value: item.id
                }));

                let filteredPosts = posts?.filter(
                    item => item.value === diagnosisData.the_reason_for_the_deviation_info?.id
                )[0];

                setDeviationList(posts);

                if (modalFormStatus === 'edit') {
                    setReasonValue(filteredPosts);
                }
            })
            .catch(() => { });
            console.log(isworker,"wwwwwwwwwwwwwwwww");
    }, []);

    useEffect(() => {
        setDiagnosisData({
            "vehicle_specification": null,
            "exact_start_time": null,
            "exact_end_time": null,
            "the_reason_for_the_deviation": null,
            "delayed_start": null,
            "start_with_haste": null,
            "delayed_end": null,
            "end_with_haste": null
        });
        setValue('proximate_start_date', '');
        setValue('proximate_start_hour', '');
        setValue('proximate_start_min', '');
        setValue('proximate_finish_date', '');
        setValue('proximate_finish_hour', '');
        setValue('proximate_finish_min', '');
        setValue('real_start_date', '');
        setValue('real_start_hour', '');
        setValue('real_start_min', '');
        setValue('real_finish_date', '');
        setValue('real_finish_hour', '');
        setValue('real_finish_min', '');
        if (whichDiagnosis) {
            Axios.get('normaluser/diagnosis/list_create/?diagnosis_id=' + whichDiagnosis)
                .then(res => {
                    let temp = res.data.results.filter(item => item.id === whichDiagnosis)[0];
                    console.log("temp1", temp);
                    // console.log("diagnosisData1", diagnosisData);
                    if (diagnosisData.exact_end_time !== null) {
                        setShowSummary(true);
                        setSummaryData({
                            delayed_start: diagnosisData.delayed_start,
                            delayed_end: diagnosisData.delayed_end,
                            start_with_haste: diagnosisData.start_with_haste,
                            end_with_haste: diagnosisData.end_with_haste
                        });
                    }

                    setValue('proximate_finish_hour', temp?.approximate_end_time_jalali.split(' - ')[1].split(':')[0]);
                    setValue('proximate_finish_min', temp?.approximate_end_time_jalali.split(' - ')[1].split(':')[1]);
                    setValue('proximate_finish_date', temp?.approximate_end_time_jalali.split(' - ')[0]);
                    setValue('proximate_start_date', temp?.approximate_start_time_jalali.split(' - ')[0]);
                    setValue('proximate_start_hour', temp?.approximate_start_time_jalali.split(' - ')[1].split(':')[0]);
                    setValue('proximate_start_min', temp?.approximate_start_time_jalali.split(' - ')[1].split(':')[1]);
                    console.log(diagnosis, temp, "res2222");

                    if (modalFormStatus === 'edit' && diagnosis[whichDiagnosis]?.exact_start_time_jalali) {
                        setValue('real_start_date', diagnosis[whichDiagnosis]?.exact_start_time_jalali.split(' - ')[0]);
                        setValue('real_start_hour', diagnosis[whichDiagnosis]?.exact_start_time_jalali.split(' - ')[1].split(':')[0]);
                        setValue('real_start_min', diagnosis[whichDiagnosis]?.exact_start_time_jalali.split(' - ')[1].split(':')[1]);
                        setValue('real_finish_date', diagnosis[whichDiagnosis]?.exact_end_time_jalali.split(' - ')[0]);
                        setValue('real_finish_hour', diagnosis[whichDiagnosis]?.exact_end_time_jalali.split(':')[0]);
                        setValue('real_finish_min', diagnosis[whichDiagnosis]?.exact_end_time_jalali.split(':')[1]);
                    }
                })
                .catch(() => { })
                .finally(() => setDataLoading(false));

            Axios.get('normaluser/time-to-troubleshoot/list_create/?diagnosis_id=' + whichDiagnosis)
                .then(res => {
                    const result = res.data.results;
                    console.log(result, "res2");
                    if (result.length > 0) {
                        const temp = result[0];
                        setDiagnosisData(temp);
                        if (modalFormStatus === 'edit' && temp?.exact_start_time_jalali) {
                            console.log(Tools.changeDateToTimeStamp("jalali", temp?.exact_start_time_jalali.split(' ')[0]));
                            setValue('real_start_date', Tools.changeDateToTimeStamp(temp?.exact_start_time_jalali.split(' ')[0]));
                            setValue('real_start_hour', temp?.exact_start_time_jalali.split(' - ')[1].split(':')[0]);
                            setValue('real_start_min', temp?.exact_start_time_jalali.split(' - ')[1].split(':')[1]);
                            if (temp?.exact_end_time_jalali) {
                                setValue('real_finish_date', Tools.changeDateToTimeStamp(temp?.exact_end_time_jalali.split(' ')[0]));
                                setValue('real_finish_hour', temp.exact_end_time_jalali.split(' - ')[1].split(':')[0]);
                                setValue('real_finish_min', temp.exact_end_time_jalali.split(' - ')[1].split(':')[1]);
                            }
                        }

                        if (temp.exact_end_time_jalali !== null) {
                            setShowSummary(true);
                            setSummaryData({
                                delayed_start: temp.delayed_start,
                                delayed_end: temp.delayed_end,
                                start_with_haste: temp.start_with_haste,
                                end_with_haste: temp.end_with_haste
                            });
                        }
                    }
                    else {
                        setDiagnosisData({
                            "vehicle_specification": null,
                            "exact_start_time": null,
                            "exact_end_time": null,
                            "the_reason_for_the_deviation": null,
                            "delayed_start": null,
                            "start_with_haste": null,
                            "delayed_end": null,
                            "end_with_haste": null
                        });
                        setValue('real_start_hour', null);
                        setValue('real_start_min', null);
                        setValue('real_start_date', null);
                        setValue('real_finish_hour', null);
                        setValue('real_finish_date', null);
                        setValue('real_finish_min', null);
                        setShowSummary(false);
                        setSummaryData({
                            delayed_start: null,
                            delayed_end: null,
                            start_with_haste: null,
                            end_with_haste: null
                        });
                    }
                })
        }
    }, [whichDiagnosis])


    const formSubmit = data => {
        setSubmitLoading(true);
        console.log(diagnosisData, "sadawdawdadwddawd");
        if (diagnosisData.exact_start_time !== null) {
            const startDate = tools.changeDateToJalali((new Date(data.real_start_date)).getFullYear() + '-' + ((new Date(data.real_start_date)).getMonth() + 1) + '-' + (new Date(data.real_start_date)).getDate()).split("-")[0].replace(/\//g, "-");
            const finishDate = tools.changeDateToJalali((new Date(data.real_finish_date)).getFullYear() + '-' + ((new Date(data.real_finish_date)).getMonth() + 1) + '-' + (new Date(data.real_finish_date)).getDate()).split("-")[0].replace(/\//g, "-");

            const newData = {
                vehicle_specification: Step1Id || chosenEditItemDetails?.diagnosis_info[0]?.vehicle_specifications,
                diagnosis: whichDiagnosis,
                the_reason_for_the_deviation: reasonValue?.value,
                exact_end_time: `${finishDate}${data.real_finish_hour}:${data.real_finish_min}:00`,
                exact_start_time: `${startDate}${data.real_start_hour}:${data.real_start_min}:00`
            };
            console.log(diagnosisData, chosenEditItemDetails, Step1Id, Step2Id, "this is");
            Axios.put(
                `normaluser/time-to-troubleshoot/retrieve_update/?pk=${diagnosisData.id || Step1Id}`,
                newData
            )
                .then(res => {
                    setShowSummary(true);
                    setDeflection(res.data.diagnosis);
                    setSummaryData({
                        delayed_start: res.data.delayed_start,
                        delayed_end: res.data.delayed_end,
                        start_with_haste: res.data.start_with_haste,
                        end_with_haste: res.data.end_with_haste
                    });
                })
                .catch(() => { })
                .finally(() => {
                    setSubmitLoading(false);
                });
        } else {
            console.log(chosenEditItemDetails, "ssssssssss");
            const startDate = tools.changeDateToJalali((new Date(data.real_start_date)).getFullYear() + '-' + ((new Date(data.real_start_date)).getMonth() + 1) + '-' + (new Date(data.real_start_date)).getDate()).split("-")[0].replace(/\//g, "-");
            const newData = {
                vehicle_specification: Step1Id || chosenEditItemDetails?.diagnosis_info[0]?.vehicle_specifications,
                diagnosis: whichDiagnosis,
                exact_start_time: `${startDate} ${data.real_start_hour}:${data.real_start_min}:00`
            };

            Axios.post('normaluser/time-to-troubleshoot/list_create/', newData)
                .then(res => {
                    setStep(1);
                    setReload(prev => !prev);
                    setIsModalOpen('');
                    setDeflection(res.data.diagnosis);
                    if (res.data.delayed_end || res.data.delayed_start || res.data.start_with_haste || res.data.end_with_haste) {
                        setConfirmModalStatus(true);
                    }
                })
                .catch(() => { })
                .finally(() => {
                    setSubmitLoading(false);
                });
        }
    };

    const handleSubmitForm = () => {
        setStep(1);
        setIsModalOpen('');
        setReload(prev => !prev);
        if (summaryData?.delayed_start || summaryData?.delayed_end || summaryData?.start_with_haste || summaryData?.end_with_haste) {
            setConfirmModalStatus(true);
        }
    };

    return (
        <form onSubmit={handleSubmit(formSubmit)}>
            {dataLoading ? (
                <div className='loading'>
                    {userInfo.role === "Admin" ? (<CircularProgress />) : "'کارشناس مربوطه هنوز ساعت تقریبی را مشخص نکرده است'"}
                </div>
            ) : (
                <>
                    <label>
                        نوع تعمیر
                    </label>
                    <Select fullWidth size='small' value={whichDiagnosis} onChange={(e) => setWhichDiagnosis(e.target.value)} >
                        {
                            diagnosis && diagnosis.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item?.type_of_repair}
                                </MenuItem>
                            ))
                        }
                    </Select>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={6}>
                            <InputComponent
                                title='تاریخ شروع'
                                placeHolder='تاریخ شروع'
                                type='text'
                                icon={UserHandUp}
                                disabled={!havePermission}
                                detail={{
                                    ...register('proximate_start_date')
                                }}
                            />
                            <TimePicker
                                disabled
                                title='زمان تقریبی شروع'
                                hourDetail={{
                                    ...register('proximate_start_hour', {
                                        required: {
                                            value: true,
                                            message: 'این فیلد اجباری است'
                                        },
                                        max: {
                                            value: 23,
                                            message: "زمان صحیح را وارد کنید"
                                        }
                                    })
                                }}
                                minDetail={{
                                    ...register('proximate_start_min', {
                                        required: {
                                            value: true,
                                            message: 'این فیلد اجباری است'
                                        },
                                        max: {
                                            value: 59,
                                            message: "زمان صحیح را وارد کنید"
                                        }
                                    })
                                }}
                            />
                            <Controller
                                control={control}
                                name='real_start_date'
                                rules={{ required: 'این فیلد اجباری است' }}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <DatePickerComponent
                                            disabled={!havePermission}
                                            value={value}
                                            onChange={onChange}
                                            minDate={new Date()}
                                            title='انتخاب تاریخ واقعی شروع'
                                            error={errors?.date}
                                        />
                                    );
                                }}
                            />
                            <br />
                            <TimePicker
                                disabled={!havePermission}
                                title='زمان واقعی شروع'
                                hourDetail={{
                                    ...register('real_start_hour', {
                                        required: {
                                            value: true,
                                            message: 'این فیلد اجباری است'
                                        },
                                        max: {
                                            value: 23,
                                            message: "زمان صحیح را وارد کنید"
                                        }
                                    })
                                }}
                                minDetail={{
                                    ...register('real_start_min', {
                                        required: {
                                            value: true,
                                            message: 'این فیلد اجباری است'
                                        },
                                        max: {
                                            value: 59,
                                            message: "زمان صحیح را وارد کنید"
                                        }
                                    })
                                }}
                                error={(errors?.real_start_hour || errors?.real_start_min) && 'این فیلد اجباری است'}
                            />


                        </Grid>

                        <Grid item xs={12} md={6}>
                            <InputComponent
                                title='تاریخ پایان'
                                placeHolder='تاریخ پایان'
                                type='text'
                                icon={UserHandUp}
                                disabled={!havePermission}
                                detail={{
                                    ...register('proximate_finish_date')
                                }}
                            />
                            <TimePicker
                                disabled
                                title='زمان تقریبی پایان'
                                hourDetail={{
                                    ...register('proximate_finish_hour', {
                                        required: {
                                            value: true,
                                            message: 'این فیلد اجباری است'
                                        },
                                        max: {
                                            value: 23,
                                            message: "زمان صحیح را وارد کنید"
                                        }
                                    })
                                }}
                                minDetail={{
                                    ...register('proximate_finish_min', {
                                        required: {
                                            value: true,
                                            message: 'این فیلد اجباری است'
                                        },
                                        max: {
                                            value: 59,
                                            message: "زمان صحیح را وارد کنید"
                                        }
                                    })
                                }}
                            />
                            <br />
                            {diagnosisData?.exact_start_time !== null && (
                                <>
                                    <Controller
                                        control={control}
                                        name='real_finish_date'
                                        rules={{ required: 'این فیلد اجباری است' }}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <DatePickerComponent
                                                    disabled={!havePermission}
                                                    value={value}
                                                    minDate={new Date()}
                                                    onChange={onChange}
                                                    title='انتخاب تاریخ واقعی پایان'
                                                    error={errors?.date}
                                                />
                                            );
                                        }}
                                    />
                                    <TimePicker
                                        title='زمان واقعی پایان'
                                        disabled={!havePermission}
                                        hourDetail={{
                                            ...register('real_finish_hour', {
                                                required: {
                                                    value: true,
                                                    message: 'این فیلد اجباری است'
                                                },
                                                max: {
                                                    value: 23,
                                                    message: "زمان صحیح را وارد کنید"
                                                }
                                            })
                                        }}
                                        minDetail={{
                                            ...register('real_finish_min', {
                                                required: {
                                                    value: true,
                                                    message: 'این فیلد اجباری است'
                                                },
                                                max: {
                                                    value: 59,
                                                    message: "زمان صحیح را وارد کنید"
                                                }
                                            })
                                        }}
                                        error={(errors?.real_finish_hour || errors?.real_finish_min) && 'این فیلد اجباری است'}
                                    />
                                    <br />
                                    <div className='left_field'>
                                        <div className='auto_complete_wrapper'>
                                            <p className='auto_complete_title'>علت انحراف</p>
                                            <div className='auto_complete'>
                                                <Autocomplete
                                                    disabled={!havePermission}
                                                    options={deviationList}
                                                    value={reasonValue}
                                                    getOptionLabel={option => option?.label}
                                                    onChange={(_, newValue) => {
                                                        setReasonValue(newValue);
                                                    }}
                                                    sx={{ width: '100%' }}
                                                    renderInput={params => <TextField {...params} />}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                        </Grid>
                        {diagnosisData?.exact_start_time !== null ? (

                            <>
                                <FormButton
                                    text='قبلی'
                                    width='fit-content'
                                    className='submit'
                                    backgroundColor={'#174787'}
                                    onClick={() => { setStep(2) }}
                                    height='48px'
                                    type='button'
                                    margin='10px 0 0 10px'
                                    padding="20px 20px 20px 20px"
                                    disabled={!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_DIAGNOSIS )|| isworker}
                                />
                                <FormButton
                                    text='محاسبه'
                                    loading={submitLoading}
                                    width='fit-content'
                                    className='submit'
                                    backgroundColor={'#174787'}
                                    onClick={() => { }}
                                    height='48px'
                                    type='submit'
                                    padding='15px'
                                    margin='10px 0 0 0'
                                />

                            </>

                        ) : (

                            <>
                                <FormButton
                                    text='قبلی'
                                    width='fit-content'
                                    className='submit'
                                    backgroundColor={'#174787'}
                                    onClick={() => { setStep(2) }}
                                    height='48px'
                                    type='button'
                                    margin='20px 0 0 10px'
                                    padding="20px 20px 20px 20px"
                                    disabled={!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_DIAGNOSIS) || isworker}
                                />
                                <FormButton
                                    text='ثبت'
                                    icon={Arrow}
                                    loading={submitLoading}
                                    width='fit-content'
                                    className='submit'
                                    backgroundColor='#174787'
                                    height='48px'
                                    type='submit'
                                    padding='15px'
                                    margin='20px 0 0 0'
                                    disabled={!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_TIME)}
                                />

                            </>


                        )}
                    </Grid>
                </>
            )}

            {showSummary &&
                (summaryData?.delayed_start || summaryData?.delayed_end || summaryData?.start_with_haste || summaryData?.end_with_haste ? (
                    <div className='summary'>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <div className='right_field'>
                                    <Grid container>
                                        <Grid item xs={12} sm={6}>
                                            <div className='pill'>
                                                <p>تاخیر در شروع</p>
                                                <div>
                                                    <img src={clockDot} alt='' />
                                                    {summaryData?.delayed_start
                                                        ? `${summaryData?.delayed_start} تاخیر در شروع`
                                                        : ' انحراف ندارد'}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div className='pill'>
                                                <p>تعجیل در شروع</p>
                                                <div>
                                                    <img src={clockDot} alt='' />
                                                    {summaryData?.start_with_haste
                                                        ? `${summaryData?.start_with_haste} تعجیل در شروع`
                                                        : ' انحراف ندارد'}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div className='pill'>
                                                <p>تاخیر در پایان</p>
                                                <div>
                                                    <img src={clockDot} alt='' />
                                                    {summaryData?.delayed_end
                                                        ? `${summaryData?.delayed_end} تاخیر در پایان`
                                                        : ' انحراف ندارد'}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div className='pill'>
                                                <p>تعجیل در پایان</p>
                                                <div>
                                                    <img src={clockDot} alt='' />
                                                    {summaryData?.end_with_haste
                                                        ? `${summaryData?.end_with_haste} تعجیل در پایان`
                                                        : ' انحراف ندارد'}
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>

                            <Grid item xs={12} md={6}></Grid>
                        </Grid>
                        <FormButton
                            text='ثبت'
                            icon={Arrow}
                            loading={submitLoading}
                            width='fit-content'
                            className='submit'
                            backgroundColor='#174787'
                            onClick={handleSubmitForm}
                            height='48px'
                            type='submit'
                            padding='15px'
                            margin='20px 0 0 0'
                            disabled={!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_TIME)}
                        />
                    </div>
                ) : (
                    <>
                        <p>انحرافی وجود ندارد</p>
                        <FormButton
                            text='ثبت'
                            icon={Arrow}
                            loading={submitLoading}
                            width='fit-content'
                            className='submit'
                            backgroundColor='#174787'
                            onClick={handleSubmitForm}
                            height='48px'
                            type='submit'
                            padding='15px'
                            margin='20px 0 0 0'
                            disabled={!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_TIME)}
                        />
                    </>
                ))}
        </form>
    );
};

export default Time;
