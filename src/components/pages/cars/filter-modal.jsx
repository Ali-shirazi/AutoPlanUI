/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//Assets
import LeftArrow from './../../../assets/images/icons/LeftArrow.svg';
import Home from './../../../assets/images/sideBar/HomeSmile.svg';
import filter from './../../../assets/images/pagesHeader/Filter.svg';
import Arrow from './../../../assets/images/global/arrow.svg';
import { FilterModalWrapper } from './filter-modal.style';
import Axios from './../../../configs/axios';

//Components
import FormButton from '../../form-groups/form-button';
import Modal from '../../template/modal';
import tools from '../../../utils/tools';

const FilterModal = ({ setShowFilterModal }) => {
    const [filterModalStatus, setFilterModalStatus] = useState('');
    const [showModalStatus, setShowModalStatus] = useState(false);
    const [manufactureData, setManufactureData] = useState([]);

    const navigate = useNavigate();
    const { handleSubmit, control, formState, reset } = useForm({
        mode: 'onTouched'
    });
    const { errors } = formState;

    useEffect(() => {
        setManufactureData([]);
        Axios.get('/superuser/manufacture/list_create')
            .then(res => {
                console.log(res.data,"manufacture");
                const newArray = res?.data?.results?.map(item => {
                    return {
                        label: item?.name,
                        value: item?.id
                    }
                });

                setManufactureData(newArray.filter(item => item !== null));
            })
            .catch(() => { });
    }, []);

    const filterFormHandler = data => {
        for (const item in data) {
            if (item === 'manufacture_id'){
                navigate(`/cars?manufacture_id=${data[item]}`);
            }
        }
        setShowFilterModal(false);
    };

    return (
        <FilterModalWrapper error={Object.keys(errors)?.length === 0 ? false : true}>
            <div className='header'>
                <img src={filter} />
                <p>فیلتر لیست ماشین ها</p>
            </div>
            <FormButton
                icon={LeftArrow}
                text='فیلتر بر اساس گروه خودرو '
                className='filter_btn'
                fontSize={14}
                onClick={() => {
                    setFilterModalStatus('گروه خودرو ');
                    setShowModalStatus(true);
                }}
            />

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
                    {filterModalStatus === 'گروه خودرو ' ? (
                        <div className='auto_complete_wrapper'>
                            <p className='auto_complete_title'>گروه خودرو </p>
                            <div className='auto_complete'>
                                <Controller
                                    control={control}
                                    name='manufacture_id'
                                    rules={{ required: 'این فیلد اجباری است' }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Autocomplete
                                                options={manufactureData || []}
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

                                <img src={Home} />
                            </div>
                            <p className='auto_complete_error'>{errors?.manufacture_id?.message}</p>
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
