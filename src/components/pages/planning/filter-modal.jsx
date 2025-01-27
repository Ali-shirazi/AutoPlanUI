/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//Assets
import LeftArrow from './../../../assets/images/icons/LeftArrow.svg';
import Command from './../../../assets/images/icons/Command.svg';
import UserCheck from './../../../assets/images/sideBar/UserCheck.svg';
import filter from './../../../assets/images/pagesHeader/Filter.svg';
import Arrow from './../../../assets/images/global/arrow.svg';
import { FilterModalWrapper } from './filter-modal.style';
import Axios from './../../../configs/axios';

//Components
import FormButton from '../../form-groups/form-button';
import Modal from '../../template/modal';
import DatePickerComponent from '../../form-groups/date-picker';
import tools from '../../../utils/tools';

const FilterModal = ({ setShowFilterModal }) => {
    const [filterModalStatus, setFilterModalStatus] = useState('');
    const [showModalStatus, setShowModalStatus] = useState(false);
    const [personnelData, setPersonnelData] = useState([]);
    const [sectionData, setSectionData] = useState([]);

    const navigate = useNavigate();
    const { handleSubmit, control, formState, reset } = useForm({
        mode: 'onTouched'
    });
    const { errors } = formState;

    useEffect(() => {
        setPersonnelData();
        Axios.get('normaluser/personnel/list_create/')
            .then(res => {
                const newArray = res?.data?.results?.map(item => {
                    if (item?.organizational_position_info?.technical_force) {
                        return {
                            label: item?.personnel?.fullname,
                            value: item?.personnel?.id
                        };
                    }
                    return null;
                });

                setPersonnelData(newArray.filter(item => item !== null));
            })
            .catch(() => { });

        Axios.get('normaluser/organizational-position/list_create/')
            .then(res => {
                const newArray = res?.data?.results?.map(item => {
                    if (item?.technical_force) {
                        return {
                            label: item?.title,
                            value: item?.id
                        };
                    }
                    return null;
                });

                setSectionData(newArray.filter(item => item !== null));
            })
            .catch(() => { });
    }, []);

    const filterFormHandler = data => {
        for (const item in data) {
            if (item === 'time') {
                navigate(`/planning?date=${tools.changeTimeStampToDate(data[item])}`);
            } else if (item === 'part') {
                navigate(`/planning?type_id=${data[item]}`);
            } else if (item === 'person') {
                navigate(`/planning?personnel_id=${data[item]}`);
            }
        }
        setShowFilterModal(false);
    };

    return (
        <FilterModalWrapper error={Object.keys(errors)?.length === 0 ? false : true}>
            <div className='header'>
                <img src={filter} />
                <p>فیلتر لیست برنامه ریزی تعمیرات</p>
            </div>
            <FormButton
                icon={LeftArrow}
                text='فیلتر بر اساس زمان'
                className='filter_btn'
                fontSize={14}
                onClick={() => {
                    setFilterModalStatus('زمان');
                    setShowModalStatus(true);
                }}
            />
            <FormButton
                icon={LeftArrow}
                text='فیلتر بر اساس بخش'
                className='filter_btn'
                fontSize={14}
                onClick={() => {
                    setFilterModalStatus('بخش');
                    setShowModalStatus(true);
                }}
            />
            <FormButton
                icon={LeftArrow}
                text='فیلتر بر اساس شخص'
                className='filter_btn'
                fontSize={14}
                onClick={() => {
                    setFilterModalStatus('شخص');
                    setShowModalStatus(true);
                }}
            />
            <FormButton text='حذف فیلتر' type='button' onClick={() => { navigate("/planning") }} padding="1rem" backgroundColor='#174787' color='white' />
            <Modal
                state={showModalStatus}
                setState={setShowModalStatus}
                handleClose={() => {
                    setFilterModalStatus('');
                    reset();
                }}
                maxWidth='sm'
            >
                <div className='header'>
                    <img src={filter} />
                    <p>فیلتر بر اساس {filterModalStatus}</p>
                </div>
                <form onSubmit={handleSubmit(filterFormHandler)}>
                    {filterModalStatus === 'زمان' ? (
                        <Controller
                            control={control}
                            name='time'
                            rules={{ required: 'این فیلد اجباری است' }}
                            render={({ field: { onChange, value } }) => {
                                return <DatePickerComponent value={value} onChange={onChange} title='زمان' error={errors?.time} />;
                            }}
                        />
                    ) : filterModalStatus === 'بخش' ? (
                        <div className='auto_complete_wrapper'>
                            <p className='auto_complete_title'>بخش</p>
                            <div className='auto_complete'>
                                <Controller
                                    control={control}
                                    name='part'
                                    rules={{ required: 'این فیلد اجباری است' }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Autocomplete
                                                options={sectionData || []}
                                                value={value?.label}
                                                onChange={(event, newValue) => {
                                                    onChange(newValue?.value);
                                                }}
                                                sx={{ width: '100%' }}
                                                renderInput={params => <TextField {...params} />}
                                            />
                                        );
                                    }}
                                />

                                <img src={Command} />
                            </div>
                            <p className='auto_complete_error'>{errors?.part?.message}</p>
                        </div>
                    ) : filterModalStatus === 'شخص' ? (
                        <div className='auto_complete_wrapper'>
                            <p className='auto_complete_title'>شخص</p>
                            <div className='auto_complete'>
                                <Controller
                                    control={control}
                                    name='person'
                                    rules={{ required: 'این فیلد اجباری است' }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Autocomplete
                                                options={personnelData || []}
                                                value={value?.label}
                                                onChange={(event, newValue) => {
                                                    onChange(newValue?.value);
                                                }}
                                                sx={{ width: '100%' }}
                                                renderInput={params => <TextField {...params} />}
                                            />
                                        );
                                    }}
                                />

                                <img src={UserCheck} />
                            </div>
                            <p className='auto_complete_error'>{errors?.person?.message}</p>
                        </div>
                    ) : null}

                    <FormButton
                        text='اعمال'
                        icon={Arrow}
                        loading={false}
                        backgroundColor={'#174787'}
                        onClick={() => { }}
                        height='48px'
                        type='submit'
                    />
                </form>
            </Modal>
        </FilterModalWrapper>
    );
};

export default FilterModal;
