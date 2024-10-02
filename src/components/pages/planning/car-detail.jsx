import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Axios from '../../../configs/axios';
import { useSelector } from 'react-redux';

//Assets
import Bus from './../../../assets/images/icons/Bus.svg';
import Arrow from './../../../assets/images/global/arrow.svg';
import PhoneIcon from './../../../assets/images/login/addPhone.svg';
import { StepsStyle } from './steps.style';

//Components
import FormButton from '../../form-groups/form-button';
import InputComponent from '../../form-groups/input-component';
import DatePickerComponent from '../../form-groups/date-picker';

// MUI
import { Autocomplete, TextField } from '@mui/material';

// Tools
import Tools from '../../../utils/tools';
import PERMISSION from '../../../utils/permission.ts';
import { IconButton, Tooltip } from '@mui/material'
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

const CarDetail = ({ setStep, setStep1Id, modalFormStatus, chosenEditItemDetails, setReload, setIsModalOpen, setManufactureId }) => {
    const userPermissions = useSelector(state => state.User.info.permission);
    const [loader, setLoader] = useState(false);
    const [manufactures, setManufactures] = useState([]);
    const [cars, setCars] = useState([]);
    const havePermission =
        modalFormStatus === 'edit' ? userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_VEHICLE_DETAILS) : true;

    const { register, handleSubmit, formState, control, setValue, watch } = useForm({
        defaultValues: {
            date: '',
            car_brand: '',
            car_type: '',
            car_model: '',
            customer_name: '',
            customer_mobile_number: '',
            plaque_4: '',
            plaque_3: '',
            plaque_2: Alphabet[0],
            plaque_1: ''
        },
        mode: 'onTouched'
    });
    const { errors } = formState;
    const selectedManufacture = watch('car_brand');
    const selectedCar = watch('car_type');

    useEffect(() => {
        Axios.get('superuser/manufacture/list_create/').then(res => {
            setManufactures(res.data.results.map(manu => {
                return {
                    id: manu.id,
                    value: manu.id,
                    label: manu.name
                };
            }));
        });
    }, []);

    useEffect(() => {
        if (!manufactures) {
            return;
        }
        if (modalFormStatus === 'edit') {
            if (chosenEditItemDetails) {
                setValue('date', Tools.changeDateToTimeStamp(chosenEditItemDetails?.date));
                let brandFound = manufactures.find(man => man.label === chosenEditItemDetails?.car_brand);
                let typeFound = cars.find(car => car.label === chosenEditItemDetails?.car_type);
                setValue('car_brand', brandFound);
                setValue('car_type', typeFound);
                setValue('car_model', chosenEditItemDetails?.car_model);
                setValue('customer_name', chosenEditItemDetails?.customer_name);
                setValue('customer_mobile_number', chosenEditItemDetails?.customer_mobile_number);
                setValue('plaque_4', chosenEditItemDetails?.plaque_4);
                setValue('plaque_3', chosenEditItemDetails?.plaque_3);
                setValue('plaque_2', {
                    label: chosenEditItemDetails?.plaque_2,
                    value: chosenEditItemDetails?.plaque_2
                });
                setValue('plaque_1', chosenEditItemDetails?.plaque_1);
            }
        }
    }, [chosenEditItemDetails, manufactures, cars]);

    useEffect(() => {
        if (!selectedManufacture || !manufactures) {
            return;
        }
        let id = selectedManufacture?.id;
        setManufactureId(id);
        Axios.get(`superuser/car/list_create/?manufacture_id=${id}`).then(res => {
            const cars = res.data.results;
            if (cars.length === 0) {
                setCars([]);
            } else {
                setCars(cars.map(car => {
                    return {
                        id: car?.id,
                        label: car?.name
                    };
                }));
            }
        });
    }, [selectedManufacture?.id, manufactures]);

    const formSubmit = data => {
        setLoader(true);

        const newData = {
            ...data,
            plaque_2: data.plaque_2.label,
            car_brand: selectedManufacture.label,
            car_type: selectedCar.label,
            date: Tools.changeTimeStampToDate(data.date)
        };

        if (modalFormStatus === 'edit' && chosenEditItemDetails?.id) {
            Axios.put(`normaluser/vehicle-specifications/retrieve_update/${chosenEditItemDetails?.id}/`, newData)
                .then(res => {
                    setReload(prev => !prev);
                    setStep(2);
                    setStep1Id(res.data.id);
                })
                .catch(() => { })
                .finally(() => {
                    setLoader(false);
                });
        } else {
            Axios.post('normaluser/vehicle-specifications/list_create/', newData)
                .then(res => {
                    setReload(prev => !prev);
                    setStep(2);
                    setStep1Id(res.data.id);
                })
                .catch(() => { })
                .finally(() => {
                    setLoader(false);
                });
        }
    };

    return (
        <StepsStyle>
            <form onSubmit={handleSubmit(formSubmit)}>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <Controller
                        control={control}
                        name='date'
                        rules={{
                            required: {
                                value: true,
                                message: 'این فیلد اجباری است'
                            }
                        }}
                        render={({ field: { onChange, value } }) => {
                            return (
                                <DatePickerComponent
                                    disabled={!havePermission}
                                    minDate={new Date()}
                                    value={value}
                                    onChange={onChange}
                                    title='انتخاب تاریخ'
                                    error={errors?.date}
                                />
                            );
                        }}
                    />
                    <Tooltip title={
                        <div style={{ color: 'black' }}>
                            تاریخ را به شمسی وارد کنید یا از تقویم انتخاب کنید.
                        </div>
                    }>
                        <IconButton>
                            <HelpRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <div className='auto_complete_wrapper' style={{ width: '100%' }}>
                        <p className='auto_complete_title'>گروه خودروساز</p>
                        <div className={errors?.repairman?.message ? 'auto_complete auto_complete_error' : 'auto_complete'}>
                            <Controller
                                control={control}
                                name='car_brand'
                                rules={{ required: 'این فیلد اجباری است' }}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <Autocomplete
                                            options={manufactures}
                                            value={value?.label || ''}
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
                        <p className='auto_complete_error_message'>{errors?.car_brand?.message}</p>
                    </div>
                    <Tooltip sx={{ width: '10%' }} title={
                        <div style={{ color: 'black' }}>
                            گروه خودروساز خودرویی که تعمیر می شود را انتخاب کنید.
                        </div>
                    }>
                        <IconButton>
                            <HelpRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <div className='auto_complete_wrapper' style={{ width: '100%' }}>
                        <p className='auto_complete_title'>خودرو</p>
                        <div className='auto_complete'>
                            <Controller
                                control={control}
                                name='car_type'
                                rules={{ required: 'این فیلد اجباری است' }}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <Autocomplete
                                            options={cars}
                                            value={value?.label || ''}
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
                        <p className='auto_complete_error_message'>{errors?.car?.message}</p>
                    </div>
                    <Tooltip sx={{ width: '10%' }} title={
                        <div style={{ color: 'black' }}>
                            ابتدا گروه خودروساز و سپس نوع خودرو را انتخاب کنید.
                        </div>
                    }>
                        <IconButton>
                            <HelpRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                {/*                 <InputComponent
                    title='برند'
                    placeHolder='برند خودرو'
                    type='text'
                    icon={Bus}
                    disabled={!havePermission}
                    detail={{
                        ...register('car_brand', {
                            required: {
                                value: true,
                                message: 'این فیلد اجباری است'
                            }
                        })
                    }}
                    error={errors?.car_brand}
                />*/}
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <InputComponent
                        title='مدل'
                        placeHolder='مدل خودرو'
                        type='tel'
                        maxLength={4}
                        icon={Bus}
                        disabled={!havePermission}
                        detail={{
                            ...register('car_model', {
                                required: {
                                    value: true,
                                    message: 'این فیلد اجباری است'
                                },
                                maxLength: {
                                    value: 4,
                                    message: 'حداکثر طول ۴ رقم است'
                                },
                                validate: value => value > 65 || 'مدل باید بزرگتر از 65 باشد'
                            })
                        }}
                        error={errors?.car_model}
                    />
                    <Tooltip sx={{ width: '10%' }} title={
                        <div style={{ color: 'black' }}>
                            سال تولید خودرو را به عدد وارد کنید.
                        </div>
                    }>
                        <IconButton>
                            <HelpRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <InputComponent
                        title='نام آورنده'
                        placeHolder='نام آورنده خودرو'
                        type='text'
                        disabled={!havePermission}
                        detail={{
                            ...register('customer_name', {
                                required: {
                                    value: true,
                                    message: 'این فیلد اجباری است'
                                }
                            })
                        }}
                        error={errors?.customer_name}
                    />
                    <Tooltip sx={{ width: '10%' }} title={
                        <div style={{ color: 'black' }}>
                            نام فردی که خودرو را به نمایندگی آورده است را وارد کنید.
                        </div>
                    }>
                        <IconButton>
                            <HelpRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <InputComponent
                        title='شماره موبایل'
                        placeHolder='09----------'
                        type='tel'
                        icon={PhoneIcon}
                        disabled={!havePermission}
                        detail={{
                            ...register('customer_mobile_number', {
                                required: {
                                    value: true,
                                    message: 'این فیلد اجباری است'
                                },
                                maxLength: {
                                    value: 11,
                                    message: 'شماره باید ۱۱ عدد باشد'
                                },
                                minLength: {
                                    value: 11,
                                    message: 'شماره باید ۱۱ عدد باشد'
                                },
                                pattern: {
                                    value: /^09\d{9}$/,
                                    message: "باید با 09 شروع شود"
                                }
                            })
                        }}
                        maxLength={11}
                        error={errors?.customer_mobile_number}
                    />
                    <Tooltip sx={{ width: '10%' }} title={
                        <div style={{ color: 'black' }}>
                            شماره موبایل فردی که خودرو را آورده است را وارد کنید.
                        </div>
                    }>
                        <IconButton>
                            <HelpRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <div className='Plaque_Field' style={{ width: '100%' }}>
                        <label>پلاک خودرو</label>
                        <div className='input_field'>
                            <InputComponent
                                maxLength={2}
                                placeHolder='--'
                                type='tel'
                                className='Plaque_inputs'
                                disabled={!havePermission}
                                detail={{
                                    ...register('plaque_4', {
                                        required: true,
                                        pattern: {
                                            value: /^\d+$/,
                                        }
                                    })
                                }}
                                error={errors?.plaque_4}
                            />
                            <InputComponent
                                placeHolder='---'
                                maxLength={3}
                                type='tel'
                                className='Plaque_inputs'
                                disabled={!havePermission}
                                detail={{
                                    ...register('plaque_3', {
                                        required: true,
                                        pattern: {
                                            value: /^\d+$/,
                                        }
                                    })
                                }}
                                error={errors?.plaque_3}
                            />
                            <div className='auto_complete'>
                                <Controller
                                    control={control}
                                    name='plaque_2'
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Autocomplete
                                                disabled={!havePermission}
                                                options={Alphabet}
                                                value={value}
                                                defaultValue={Alphabet}
                                                filterSelectedOptions
                                                getOptionLabel={option => option.label}
                                                onChange={(_, newValue) => {
                                                    onChange(newValue);
                                                }}
                                                sx={{ width: '100%' }}
                                                renderInput={params => <TextField {...params} />}
                                            />
                                        );
                                    }}
                                />
                            </div>

                            <InputComponent
                                placeHolder='--'
                                maxLength={2}
                                type='tel'
                                disabled={!havePermission}
                                className='Plaque_inputs'
                                detail={{
                                    ...register('plaque_1', {
                                        required: true,
                                        pattern: {
                                            value: /^\d+$/,
                                        }
                                    })
                                }}
                                error={errors?.plaque_1}
                            />
                            <div className='flag'>
                                <span className='green'></span>
                                <span></span>
                                <span className='red'></span>
                            </div>
                        </div>
                    </div>
                    <Tooltip sx={{ width: '10%' }} title={
                        <div style={{ color: 'black' }}>
                            پلاک خودرو را وارد کنید.
                        </div>
                    }>
                        <IconButton>
                            <HelpRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className='button_box'>
                    <FormButton
                        text='بعدی'
                        icon={Arrow}
                        loading={loader}
                        className='login'
                        backgroundColor={'#174787'}
                        height='48px'
                        type='submit'
                        disabled={!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_VEHICLE_DETAILS)}
                    />
                </div>
            </form>
        </StepsStyle >
    );
};

export default CarDetail;

const Alphabet = [
    {
        label: 'الف',
        value: 'الف'
    },
    {
        label: 'ب',
        value: 'ب'
    },
    {
        label: 'پ',
        value: 'پ'
    },
    {
        label: 'ت',
        value: 'ت'
    },
    {
        label: 'ث',
        value: 'ث'
    },
    {
        label: 'ج',
        value: 'ج'
    },
    {
        label: 'چ',
        value: 'چ'
    },
    {
        label: 'ح',
        value: 'ح'
    },
    {
        label: 'خ',
        value: 'خ'
    },
    {
        label: 'د',
        value: 'د'
    },
    {
        label: 'ذ',
        value: 'ذ'
    },
    {
        label: 'ر',
        value: 'ر'
    },
    {
        label: 'ز',
        value: 'ز'
    },
    {
        label: 'ژ',
        value: 'ژ'
    },
    {
        label: 'س',
        value: 'س'
    },
    {
        label: 'ش',
        value: 'ش'
    },
    {
        label: 'ص',
        value: 'ص'
    },
    {
        label: 'ض',
        value: 'ض'
    },
    {
        label: 'ط',
        value: 'ط'
    },
    {
        label: 'ظ',
        value: 'ظ'
    },
    {
        label: 'ع',
        value: 'ع'
    },
    {
        label: 'غ',
        value: 'غ'
    },
    {
        label: 'ف',
        value: 'ف'
    },
    {
        label: 'ق',
        value: 'ق'
    },
    {
        label: 'ک',
        value: 'ک'
    },
    {
        label: 'گ',
        value: 'گ'
    },
    {
        label: 'ل',
        value: 'ل'
    },
    {
        label: 'م',
        value: 'م'
    },
    {
        label: 'ن',
        value: 'ن'
    },
    {
        label: 'و',
        value: 'و'
    },
    {
        label: 'ه',
        value: 'ه'
    },
    {
        label: 'ی',
        value: 'ی'
    },
    {
        label: 'D',
        value: 'D'
    },
    {
        label: 'S',
        value: 'S'
    }
];
