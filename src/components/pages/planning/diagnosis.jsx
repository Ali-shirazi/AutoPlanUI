/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Axios from '../../../configs/axios';
import { v4 as uuidv4 } from 'uuid';
import PERMISSION from '../../../utils/permission.ts';
import { useSelector } from 'react-redux';

//Assets
import Arrow from './../../../assets/images/global/arrow.svg';
import ShockAbsorber from './../../../assets/images/icons/ShockAbsorber.svg';
import UserHandUp from './../../../assets/images/icons/UserHandUp.svg';
import trashBin from './../../../assets/images/global/TrashBin.svg';
import closeIcon from './../../../assets/images/global/closeIcon.svg';

//Components
import InputComponent from '../../form-groups/input-component';
import FormButton from '../../form-groups/form-button';
import DatePickerComponent from '../../form-groups/date-picker';

//Mui
import { Autocomplete, CircularProgress, Grid, TextField, Box } from '@mui/material';
import TimePicker from '../../form-groups/time-picker';
import { Dialog, Slide } from '@mui/material';
import styled from '@emotion/styled';

// import Tools from '../../../utils/tools';
import tools from '../../../utils/tools';

export const MainField = styled.div(() => ({
    '& .modal_content_field': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '40px 50px',
        gap: '20px'
    },

    '& .button_group': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: '10px',

        button: {
            height: '48px'
        }
    },

    '& .MuiPaper-elevation': {
        borderRadius: '20px'
    },

    h3: {
        fontSize: '1.3rem',
        marginBottom: '20px'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});

const ConfirmModal = ({ status, setStatus, title, description, nextStep, loading, reset }) => {
    return (
        <Dialog
            open={status}
            TransitionComponent={Transition}
            keepMounted={false}
            onClose={() => setStatus(false)}
            fullWidth={true}
            maxWidth='sm'
            scroll='body'
        >
            <MainField>
                <div className='modal_content_field'>
                    <h3 style={{ color: '#228833', marginBottom: '20px' }}>{title}</h3>
                    <h3 style={{ color: '#000' }}>{description}</h3>
                    <div className='button_group'>
                        <FormButton text='بله' backgroundColor='#5F7D88' onClick={() => { reset(); setStatus(false) }} />
                        <FormButton text='بعدی' icon={Arrow} backgroundColor='#174787' onClick={nextStep} loading={loading} />
                    </div>
                </div>
            </MainField>
        </Dialog>
    );
};

const ConfirmForGoNextDayModal = ({ status, setStatus, submitToday, submitTommorow, loading }) => {
    return (
        <Dialog
            open={status}
            TransitionComponent={Transition}
            keepMounted={false}
            onClose={() => setStatus(false)}
            fullWidth={true}
            maxWidth='sm'
            scroll='body'
        >
            <MainField>
                <div className='modal_content_field'>
                    <h3>زمان وارد شده خارج از ساعت کاری نمایندگی است، آیا میخواهید این کار در هر صورت انجام شود؟ </h3>
                    <div className='button_group'>
                        {/* <FormButton text='بله' backgroundColor='#174787' onClick={() => { submitToday(); setStatus(false) }} loading={loading} /> */}
                        <FormButton text='ادامه کار برای روز بعد' backgroundColor='#5F7D88' onClick={() => { submitTommorow(); setStatus(false) }} />
                    </div>
                </div>
            </MainField>
        </Dialog>
    );
};

const Diagnosis = ({ setStep, Step1Id, setStep2Id, modalFormStatus, chosenEditItemDetails, setReload, setIsModalOpen, manufactureId }) => {
    const userPermissions = useSelector(state => state.User.info.permission);
    const addInputPartRef = useRef();
    const [loader, setLoader] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [postsList, SetPostsList] = useState([]);
    const [partsList, setPartsList] = useState([]);
    const [diagnosis, setDiagnosis] = useState([]);
    const [partsArray, setPartsArray] = useState([]);
    const [modalStatus, setModalStatus] = useState(false);
    const [timeModalStatus, setTimeModalStatus] = useState(false);
    const [representation_start_time_hour, setRSTH] = useState();
    const [representation_start_time_min, setRSTM] = useState();
    const [representation_end_time_hour, setRETH] = useState();
    const [representation_end_time_min, setRETM] = useState();
    const [tempData, setTempData] = useState({
        pyramid_number: "",
        repairman: "",
        type_of_repair: "",
        vehicle_specifications: "",
        representation_start_time: "",
        representation_end_time: "",
        should_go_to_next_day: false,
        approximate_start_time: "",
        work_time_frame: "",
        required_pieces: ""
    });
    const [secondstepstatus, setSecondstepstatus] = useState(false);
    const [partid, setPartid] = useState();

    const havePermission =
        modalFormStatus === 'edit' ? userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_DIAGNOSIS) : true;

    const { register, handleSubmit, formState, control, setValue, watch, reset, getValues } = useForm({
        defaultValues: {
            type_of_repair: '',
            repairman: '',
            pyramid_number: '',
            required_pieces: [],
            approximate_start_time_hour: '',
            approximate_start_time_min: '',
            approximate_duration_hour: '',
            approximate_duration_min: ''
        },
        mode: 'onTouched'
    });
    const { errors } = formState;
    const parts = watch('required_pieces');

    useEffect(() => {
        Axios.get(`normaluser/part/list_create/?manufacture_id=${manufactureId}`).then(res => {
            setPartsList(res.data.results.map((part) => {
                return `${part?.code}-${part?.name}`
            }));
            setPartid(res.data.results.map((part) => {
                return `${part?.id}-${part?.code}`
            }));
        });
    }, []);

    useEffect(() => {
        Axios.get('normaluser/representation-working-hours/list_create/')
            .then(res => {
                if (res.data.results.length) {
                    const start_time = res.data.results[0].start_time.split(':');
                    const end_time = res.data.results[0].end_time.split(':');
                    setRSTH(start_time[0]);
                    setRSTM(start_time[1]);
                    setRETH(end_time[0]);
                    setRETM(end_time[1]);
                }
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        setDataLoading(true);
        getDiagnosis();
        Axios.get('/normaluser/capacity-measurement/list_create/')
            .then(res => {
                let prepost = res.data.results.filter((fitem) => {
                    return fitem.date === tools.changeDateToJalali(new Date()).split("-")[0].replace(/\//g, "-").trim();
                });
                let posts = prepost.map(item => ({
                    label: `${item?.user_info?.personnel?.fullname} - ${item?.user_info?.organizational_position_info.title} - ${item?.user_info?.code ? item?.user_info?.code : ''}`,
                    value: item?.id,
                    date: item?.date,
                }));

                SetPostsList(posts);
                if (modalFormStatus === 'edit' && chosenEditItemDetails?.diagnosis_info?.id) {
                    if (chosenEditItemDetails) {
                        setValue('type_of_repair', chosenEditItemDetails?.diagnosis_info?.type_of_repair);
                        setValue('repairman', {
                            label: `${chosenEditItemDetails?.diagnosis_info?.repairman_info?.user_info?.personnel?.fullname} - ${chosenEditItemDetails?.diagnosis_info?.repairman_info?.user_info?.organizational_position_info?.title} - ${chosenEditItemDetails?.diagnosis_info?.repairman_info?.user_info?.code ? chosenEditItemDetails?.diagnosis_info?.repairman_info?.user_info?.code : ''}`,
                            value: chosenEditItemDetails?.diagnosis_info?.repairman_info?.id
                        });
                        setValue('pyramid_number', chosenEditItemDetails?.diagnosis_info?.pyramid_number);
                        setValue('approximate_start_time_hour', chosenEditItemDetails?.diagnosis_info?.approximate_start_time.slice(0, 2));
                        setValue('approximate_start_time_min', chosenEditItemDetails?.diagnosis_info?.approximate_start_time.slice(3, 5));
                        setValue('approximate_duration_hour', chosenEditItemDetails?.diagnosis_info?.approximate_duration.slice(0, 2));
                        setValue('approximate_duration_min', chosenEditItemDetails?.diagnosis_info?.approximate_duration.slice(3, 5));
                        setValue('required_pieces', chosenEditItemDetails?.diagnosis_info?.required_pieces);
                    }
                }
            })
            .finally(() => setDataLoading(false));
    }, [chosenEditItemDetails]);



    const formSubmit = (data) => {
        if (chosenEditItemDetails?.diagnosis_info?.length > 0 || Boolean(getValues("approximate_duration_hour") && getValues("approximate_duration_min") && getValues("approximate_start_time_hour") && getValues("approximate_start_time_min") && getValues("pyramid_number") && getValues("type_of_repair") && getValues("repairman"))) {
            const date = tools.changeTimeStampToDate(data.date);
            let newparts = parts.map(part => part.split("-")[0]);
            let codeMap = new Map();
    
            // Populate the map with the code portion of each partid entry
            partid.forEach(part => {
                let [id, code] = part.split('-');
                codeMap.set(code, part);  // Store the full part string associated with the code
            });
    
            // Filter the partid array based on newparts
            let partidresult = newparts.map(code => codeMap.get(code)).filter(part => part !== undefined);
            let finalId = partidresult.map(part => Number(part.split("-")[0]));
            let afterTime = false;
            let duration = Number(data?.approximate_start_time_hour) + Number(data?.approximate_duration_hour);
    
            if (Number(duration) > Number(representation_end_time_hour)) {
                afterTime = true;
                setSecondstepstatus(true);
            } else {
                afterTime = false;
                setSecondstepstatus(true);
            }
    
            const newData = {
                pyramid_number: data.pyramid_number,
                repairman: data.repairman.value,
                type_of_repair: data.type_of_repair,
                vehicle_specifications: Step1Id || chosenEditItemDetails?.diagnosis_info[0]?.id,
                representation_start_time: representation_start_time_hour + ':' + representation_start_time_min,
                representation_end_time: representation_end_time_hour + ':' + representation_end_time_min,
                should_go_to_next_day: afterTime || false,
                approximate_start_time: `${date} ${data?.approximate_start_time_hour}:${data?.approximate_start_time_min}:00`,
                work_time_frame: `${data?.approximate_duration_hour}:${data.approximate_duration_min}`,
                required_pieces: finalId
            };
    
            setTempData(newData);
    
            if (afterTime === true && newData.approximate_start_time) {
                setModalStatus(true);
                setTimeModalStatus(false);
                setLoader(false);
                return;
            } else {
                submitToday(newData);
            }
        }
    };
    
    const submitToday = (data) => {
        if (modalFormStatus === 'edit' && chosenEditItemDetails?.diagnosis_info?.length &&
            chosenEditItemDetails?.diagnosis_info[0]?.id && data["should_go_to_next_day"] === false) {
    
            Axios.post(`normaluser/diagnosis/list_create/`, data)
                .then(res => {
                    console.log("dddddres1", res);
                    setStep2Id(res.data.id);
                    setTimeModalStatus(true);
                })
                .catch((err) => {
                    handleErrors(err);
                })
                .finally(() => {
                    setLoader(false);
                });
    
        } else if (!chosenEditItemDetails?.diagnosis_info?.length && data && data["should_go_to_next_day"] === false) {
    
            Axios.post('normaluser/diagnosis/list_create/', data)
                .then(res => {
                    setStep2Id(res.data.id);
                    setTimeModalStatus(true);
                })
                .catch((err) => {
                    handleErrors(err);
                })
                .finally(() => {
                    setLoader(false);
                });
    
        } else {
            setModalStatus(false);
            setTimeModalStatus(true);
            setLoader(false);
        }
        setTimeModalStatus(true);
    };
    
    const handleErrors = (err) => {
        const errorMessages = err?.response?.data?.error;
        if (Array.isArray(errorMessages)) {
            if (errorMessages[0] === "زمان کاری بیشتر از زمان کاری نمایندگی است!") {
                setTimeModalStatus(false);
                setModalStatus(true);
            } else if (errorMessages[0] === "پرسنل در حال کار است! نمیتوانید از آن استفاده کنید") {
                setModalStatus(false);
                setTimeModalStatus(false);
            } else {
                setModalStatus(false);
                setTimeModalStatus(true);
            }
        }
    }
    

    const submitTommorow = () => {
        setModalStatus(false);
        setTimeModalStatus(true);
        tempData["should_go_to_next_day"] = true;
        if (modalFormStatus === 'edit' && chosenEditItemDetails?.diagnosis_info?.id) {
            console.log("ddddd7", tempData);
            Axios.put(`normaluser/diagnosis/retrieve_update_destroy/${chosenEditItemDetails?.diagnosis_info?.id}/`, tempData)
                .then(res => {
                    setStep2Id(res.data.id);
                    setModalStatus(true);
                })
                .catch(() => { })
                .finally(() => {
                    setModalStatus(false);
                    setTimeModalStatus(true);
                    setLoader(false);
                });
        } else if (tempData) {
            console.log(tempData, "ddddd8");
            Axios.post('normaluser/diagnosis/list_create/', tempData)
                .then(res => {
                    setModalStatus(true);
                    setStep2Id(res.data.id);

                })
                .catch((err) => {
                    if (err?.response?.data?.error[0] == "زمان کاری بیشتر از زمان کاری نمایندگی است!") {
                        setTimeModalStatus(false);
                        setModalStatus(true);
                    } else if (err?.response?.data?.error[0] == "پرسنل در حال کار است! نمیتوانید از آن استفاده کنید") {
                        setModalStatus(false);
                        setTimeModalStatus(false);
                    } else {
                        setModalStatus(false) && setTimeModalStatus(false);
                    }
                }).finally(() => {
                    setModalStatus(false);
                    setTimeModalStatus(true);
                    setLoader(false);
                });
        }
    }

    async function getDiagnosis() {
        await Axios.get('normaluser/diagnosis/list_create/?vehicle_specification_id=' + Step1Id)
            .then(res => {
                res.data?.count === 0 ? null : setSecondstepstatus(true);
                setDiagnosis(res.data?.results);
            });
    }

    const deleteDiagnosis = (id) => {
        Axios.delete('normaluser/diagnosis/retrieve_update_destroy/' + id + "/")
            .then(res => {
                getDiagnosis();
            })
    }


    const goToNextStep = async () => {
        try {
            await getDiagnosis();
            if (secondstepstatus === true) {
                setTimeModalStatus(false);
                setReload(prev => !prev);
                setStep(3);
                setStep2Id(Step1Id);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Box sx={{ width: '100%', display: 'flex' }}>
                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                    {diagnosis.map((item, index) => (
                        <Box key={item?.id} sx={{ display: 'flex', fontSize: '14px', padding: '15px', justifyContent: 'space-between', backgroundColor: '#ffff', marginBottom: '15px', boxShadow: '3px 5px 5px #3333;', borderRadius: '5px', flexDirection: 'row', gap: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'start', gap: '5px', alignItems: 'center' }}>
                                <span style={{ borderStyle: 'solid', borderWidth: '2px', paddingTop: '1px', paddingBottom: '1px', paddingRight: '8px', paddingLeft: '8px' }}>
                                    {index + 1}
                                </span>
                                <span>{item?.type_of_repair}</span>
                            </div>
                            <span>{item?.repairman_info?.type?.type_info?.title}</span>
                            <span>{item?.repairman_info?.date.replace('-', '/').replace('-', '/')}</span>
                            <FormButton
                                width={20}
                                icon={trashBin}
                                onClick={() => deleteDiagnosis(item?.id)}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
            <form onSubmit={handleSubmit(formSubmit)} className='form_double_col'>
                {dataLoading ? (
                    <div className='loading'>
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <InputComponent
                                    title='نوع تعمیر'
                                    placeHolder='نوع تعمیر خودرو'
                                    type='text'
                                    disabled={!havePermission}
                                    icon={ShockAbsorber}
                                    detail={{
                                        ...register('type_of_repair', modalFormStatus === 'edit' ? {} : {
                                            required: {
                                                value: true,
                                                message: 'این فیلد اجباری است'
                                            }
                                        })
                                    }}
                                    error={errors?.type_of_repair}
                                />
                                <div className='auto_complete_wrapper'>
                                    <p className='auto_complete_title'>نام تعمیرکار</p>
                                    <div className={errors?.repairman?.message ? 'auto_complete auto_complete_error' : 'auto_complete'}>
                                        <Controller
                                            control={control}
                                            name='repairman'
                                            rules={modalFormStatus === 'edit' ? {} : { required: 'این فیلد اجباری است' }}
                                            render={({ field: { onChange, value } }) => {
                                                return (
                                                    <Autocomplete
                                                        disabled={!havePermission}
                                                        options={postsList}
                                                        value={value}
                                                        onChange={(event, newValue) => {
                                                            onChange(newValue);
                                                        }}
                                                        sx={{ width: '100%' }}
                                                        renderInput={params => <TextField {...params} />}
                                                    />
                                                );
                                            }}
                                        />
                                    </div>
                                    <p className='auto_complete_error_message'>{errors?.repairman?.message}</p>
                                </div>

                                <InputComponent
                                    title='شماره هرم'
                                    placeHolder='شماره هرم'
                                    type='text'
                                    icon={UserHandUp}
                                    disabled={!havePermission}
                                    detail={{
                                        ...register('pyramid_number')
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <Controller
                                    control={control}
                                    name='date'
                                    rules={modalFormStatus === 'edit' ? {} : { required: 'این فیلد اجباری است' }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <DatePickerComponent
                                                minDate={new Date()}
                                                disabled={!havePermission}
                                                value={value}
                                                onChange={onChange}
                                                title='انتخاب تاریخ'
                                                error={errors?.date}
                                            />
                                        );
                                    }}
                                />
                                <TimePicker
                                    disabled={!havePermission}
                                    title='زمان تقریبی شروع'
                                    hourDetail={{
                                        ...register('approximate_start_time_hour', modalFormStatus === 'edit' ? {
                                            required: {
                                                value: false
                                            },
                                            max: {
                                                value: 23,
                                                message: "زمان صحیح را وارد کنید"
                                            }
                                        } : {
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
                                        ...register('approximate_start_time_min', modalFormStatus === 'edit' ? {
                                            required: {
                                                value: false,
                                            },
                                            max: {
                                                value: 59,
                                                message: "زمان صحیح را وارد کنید"
                                            }
                                        } : {
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
                                    error={(errors?.approximate_start_time_hour || errors?.approximate_start_time_min) && 'این فیلد اجباری است'}
                                />

                                <TimePicker
                                    disabled={!havePermission}
                                    title='مدت زمان'
                                    hourDetail={{
                                        ...register('approximate_duration_hour', modalFormStatus === 'edit' ? {
                                            required: {
                                                value: false
                                            },
                                            max: {
                                                value: 23,
                                                message: "زمان صحیح را وارد کنید"
                                            }
                                        } : {
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
                                        ...register('approximate_duration_min', modalFormStatus === 'edit' ? {
                                            required: {
                                                value: false
                                            },
                                            max: {
                                                value: 59,
                                                message: "زمان صحیح را وارد کنید"
                                            }
                                        } : {
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
                                    error={(errors?.approximate_duration_hour || errors?.approximate_duration_min) && 'این فیلد اجباری است'}
                                />

                                <div className='auto_complete_wrapper'>
                                    <p className='auto_complete_title'>کسری قطعه</p>
                                    <div className='auto_complete'>
                                        <Controller
                                            control={control}
                                            name='required_pieces'
                                            render={({ field: { onChange, value } }) => {
                                                return (
                                                    <Autocomplete
                                                        options={partsList}
                                                        value={value}
                                                        multiple
                                                        onChange={(event, newValue) => {
                                                            onChange(newValue);
                                                        }}
                                                        sx={{ width: '100%' }}
                                                        renderInput={params => <TextField {...params} />}
                                                    />
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className='options_array'>
                                    {partsArray.map(item => (
                                        <div
                                            className='options_wrapper'
                                            key={item.id}
                                            onClick={() => setPartsArray(prev => prev.filter(filed => filed !== item))}
                                        >
                                            <p className='options_text'>{item.label}</p>
                                            <img src={closeIcon} className='options_img' />
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <FormButton
                                text='ثبت'
                                loading={loader}
                                width='fit-content'
                                className='submit'
                                backgroundColor={'#174787'}
                                onClick={() => { }}
                                height='48px'
                                type='submit'
                                disabled={!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_DIAGNOSIS)}
                            />

                        </Grid>
                        <Grid item xs={12}>

                            <FormButton
                                text='بعدی'
                                loading={loader}
                                width='fit-content'
                                className='submit'
                                backgroundColor={'#174787'}
                                onClick={() => { goToNextStep() }}
                                height='48px'
                                type='button'
                                disabled={!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_DIAGNOSIS) && diagnosis.length == 0}
                            />
                        </Grid>
                        <Grid item xs={12}>

                            <FormButton
                                text='قبلی'
                                loading={loader}
                                width='fit-content'
                                className='submit'
                                backgroundColor={'#174787'}
                                onClick={() => { setStep(1) }}
                                height='48px'
                                type='button'
                                disabled={!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_DIAGNOSIS)}
                            />
                        </Grid>
                    </>
                )}
            </form>
            <ConfirmForGoNextDayModal
                status={modalStatus}
                loading={false}
                setStatus={setModalStatus}
                submitToday={submitToday}
                submitTommorow={submitTommorow}
            />
            <ConfirmModal
                status={timeModalStatus}
                setStatus={setTimeModalStatus}
                title={"اطلاعات با موفقیت ثبت شد"}
                reset={() => { }}
                description={"کاربر گرامی نیاز دارید اطلاعات جدید ثبت کنید؟"}
                nextStep={() => { goToNextStep(); }}
                loading={false}
            />

        </>
    );
};

export default Diagnosis;
