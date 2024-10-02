/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Axios from '../../configs/axios';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';

//Assets
import trashBin from './../../assets/images/global/TrashBin.svg';
import pen from './../../assets/images/global/pen.svg';
import document from './../../assets/images/sideBar/DocumentAdd.svg';
import widget from './../../assets/images/sideBar/WidgetAdd.svg';
import { ActionCell } from '../deviation/deviation.style';
import { CarWrapper } from './cars.style';

//Components
import FormButton from '../../components/form-groups/form-button';
import PagesHeader from '../../components/template/pages-header';
import Table from '../../components/template/Table';
import Modal from '../../components/template/modal';
import InputComponent from '../../components/form-groups/input-component';
import ConfirmModal from '../../components/template/confirm-modal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterModal from '../../components/pages/cars/filter-modal';

const Car = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('');
    const [confirmModalStatus, setConfirmModalStatus] = useState(false);
    const [manufactureList, setManufactureList] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [stationData, setStationData] = useState();
    const [loader, setLoader] = useState(true);
    const [reload, setReload] = useState(false);
    const [specificDeviationId, setSpecificDeviationId] = useState();
    const [buttonLoader, setButtonLoader] = useState({
        modalButton: false,
        delete: false
    });

    const [pageStatus, setPageStatus] = useState({
        total: 1,
        current: 1
    });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const manufactureQuery = searchParams.get('manufacture_id');

    const { register, control, handleSubmit, formState, reset, setValue, watch } = useForm({
        mode: 'onTouched'
    });
    const { errors } = formState;

    useEffect(() => {
        setLoader(true);
        Axios.get(`superuser/car/list_create/?page=${pageStatus.current}`,{
            params: {
                ...(manufactureQuery && {
                    manufacture_id : manufactureQuery
                }),
            }
        })
            .then(res => {
                setStationData(res.data.results);
                setPageStatus({
                    ...pageStatus,
                    total: res?.data?.count/ 15 < 1 ? "1" : Math.ceil(res?.data?.count/ 15)
                });
                setLoader(false);
            })
            .catch(() => { });
        Axios.get('superuser/manufacture/list_create/?page_size=500')
            .then(res => {
                let temp = [];
                console.log(res.data,"locations");
                res.data.results.map(item => {
                    temp.push({
                        label: item.name,
                        value: item.id
                    });
                    return;
                });

                setManufactureList(temp);
            })
            .catch(() => { });
    }, [pageStatus.current, reload, manufactureQuery]);

    const columns = [
        { id: 1, title: 'ردیف', key: 'index' },
        {
            id: 2,
            title: 'تاریخ',
            key: 'create_at'
        },
        { id: 4, title: 'نام ماشین', key: 'name' },
        {
            id: 6,
            title: 'گروه خودرو ',
            key: 'manufacture',
            renderCell: data => manufactureList.filter(item => item.value === data.manufacture.id)[0]?.label
        },
        {
            id: 7,
            title: 'عملیات',
            key: 'actions',
            renderCell: data => (
                <ActionCell>
                    <FormButton
                        icon={pen}
                        onClick={() => editModalHandler(data)}
                    />
                    <FormButton
                        icon={trashBin}
                        onClick={() => deleteModalHandler(data.id)}
                    />
                </ActionCell>
            )
        }
    ];

    const formSubmit = data => {
        setButtonLoader({ ...buttonLoader, modalButton: true });

        const newData = {
            ...data
        };

        if (modalStatus === 'add') {
            Axios.post('superuser/car/list_create/', newData)
                .then(() => {
                    setReload(!reload);
                    toast.success('ماشین جدید با موفقیت ثبت شد');
                    setModalOpen(false);
                    closeModalFunctions();
                })
                .catch(() => { })
                .finally(() => setButtonLoader({ ...buttonLoader, modalButton: false }));
        } else {
            Axios.put(`superuser/car/retrieve_update_destroy/${specificDeviationId}/`, newData)
                .then(() => {
                    setReload(!reload);
                    toast.success('ماشین با موفقیت ویرایش شد');
                    setModalOpen(false);
                    closeModalFunctions();
                })
                .catch(() => { })
                .finally(() => setButtonLoader({ ...buttonLoader, modalButton: false }));
        }
    };

    const editModalHandler = data => {
        setModalStatus('edit');
        setModalOpen(true);
        setValue('name', data.name);
        setValue('manufacture_id', data.manufacture.id);
        setSpecificDeviationId(data.id);
    };

    const deleteModalHandler = id => {
        setConfirmModalStatus(true);
        setSpecificDeviationId(id);
    };

    const addModalHandler = () => {
        setModalStatus('add');
        setModalOpen(true);
    };

    const deleteHandler = () => {
        setButtonLoader({ ...buttonLoader, delete: true });
        Axios.delete(`superuser/car/retrieve_update_destroy/${specificDeviationId}/`)
            .then(() => {
                setButtonLoader({ ...buttonLoader, delete: false });
                setReload(!reload);
                toast.success('ماشین  با موفقیت حذف شد');
                setConfirmModalStatus(false);
                setPageStatus({
                    ...pageStatus,
                    current: 1
                });
            })
            .catch(() => { });
    };

    const closeModalFunctions = () => {
        reset();
        setSpecificDeviationId();
    };

    return (
        <CarWrapper error={errors?.type?.message}>
            <PagesHeader
                buttonTitle='ثبت ماشین جدید'
                secondFiled='ساعت کاری مجموعه : ۸ ساعت'
                hasFilter={true}
                onFilterClick={() => setShowFilterModal(true)}
                onButtonClick={addModalHandler}
            />
            
            <Table columns={columns} rows={stationData} pageStatus={pageStatus} setPageStatus={setPageStatus} loading={loader} />
            <Modal state={showFilterModal} setState={setShowFilterModal} maxWidth='sm'>
                <FilterModal setReload={setReload} setShowFilterModal={setShowFilterModal} />
                <FormButton text='حذف فیلتر' type='button' onClick={()=>{navigate("/cars" && setShowFilterModal(false))}} padding="1rem" backgroundColor='#174787' color='white' />
            </Modal>
            
            <Modal state={modalOpen} setState={setModalOpen} handleClose={closeModalFunctions} bgStatus={true}>
                <div className='formControl'>
                    {modalStatus === 'add' ? <h2>فرم ثبت ماشین</h2> : <h2>ویرایش ماشین</h2>}
                    <form onSubmit={handleSubmit(formSubmit)}>
                        <InputComponent
                            title='نام ماشین'
                            icon={document}
                            detail={{
                                ...register('name', {
                                    required: {
                                        value: true,
                                        message: 'این فیلد اجباری است'
                                    }
                                })
                            }}
                            error={errors?.code}
                            placeHolder='نام ماشین'
                        />
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
                                                options={manufactureList}
                                                value={manufactureList?.filter(item => item.value === value)[0] || ""}
                                                onChange={(_, newValue) => {
                                                    onChange(newValue?.value);
                                                }}
                                                sx={{ width: '100%' }}
                                                renderInput={params => <TextField {...params} />}
                                            />
                                        );
                                    }}
                                />
                                <img src={widget} />
                            </div>
                            <p className='auto_complete_error'>{errors?.type?.message}</p>
                        </div>
                        <FormButton
                            text={modalStatus === 'edit' ? 'ویرایش' : 'ثبت'}
                            type='submit'
                            backgroundColor='#174787'
                            color='white'
                            height={48}
                            loading={buttonLoader.modalButton}
                        />
                    </form>
                </div>
            </Modal>
            <ConfirmModal
                status={confirmModalStatus}
                setStatus={setConfirmModalStatus}
                title='آیا از حذف این ردیف مطمئن هستید ؟'
                deleteHandler={deleteHandler}
                loading={buttonLoader.delete}
            />
        </CarWrapper>
    );
};

export default Car;
