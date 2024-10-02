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
import { PartWrapper } from './parts.style';
import xlsx from '../../assets/createexample.xlsx';

//Components
import FormButton from '../../components/form-groups/form-button';
import PagesHeader from '../../components/template/pages-header';
import Table from '../../components/template/Table';
import Modal from '../../components/template/modal';
import InputComponent from '../../components/form-groups/input-component';
import ConfirmModal from '../../components/template/confirm-modal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterModal from '../../components/pages/parts/filter-modal';

import UploadFile from '../../components/form-groups/UploadFile';

// MUI
import { Tab, Tabs } from '@mui/material';

const Part = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('');
    const [confirmModalStatus, setConfirmModalStatus] = useState(false);
    const [manufactureList, setManufactureList] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [stationData, setStationData] = useState();
    const [loader, setLoader] = useState(true);
    const [reload, setReload] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [specificDeviationId, setSpecificDeviationId] = useState();
    const [buttonLoader, setButtonLoader] = useState({
        modalButton: false,
        delete: false
    });

    const [pageStatus, setPageStatus] = useState({
        total: 1,
        current: 1
    });

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const manufactureQuery = searchParams.get('manufacture_id');

    const { register, control, handleSubmit, formState, reset, setValue, watch } = useForm({
        mode: 'onTouched'
    });
    const { errors } = formState;

    const handleChange = (_, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        setLoader(true);
        Axios.get(`normaluser/part/list_create/?page=${pageStatus.current}`, {
            params: {
                ...(manufactureQuery && {
                    manufacture_id: manufactureQuery
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
        { id: 4, title: 'نام قطعه', key: 'name' },
        { id: 5, title: 'کد قطعه', key: 'code' },
        {
            id: 6,
            title: 'برند',
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
            Axios.post('normaluser/part/list_create/', newData)
                .then(() => {
                    setReload(!reload);
                    toast.success('قطعه جدید با موفقیت ثبت شد');
                    setModalOpen(false);
                    closeModalFunctions();
                })
                .catch(() => { })
                .finally(() => setButtonLoader({ ...buttonLoader, modalButton: false }));
        } else {
            Axios.put(`normaluser/part/retrieve_update_destroy/${specificDeviationId}/`, newData)
                .then(() => {
                    setReload(!reload);
                    toast.success('قطعه با موفقیت ویرایش شد');
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
        setValue('code', data.code);
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
        Axios.delete(`normaluser/part/retrieve_update_destroy/${specificDeviationId}/`)
            .then(() => {
                setButtonLoader({ ...buttonLoader, delete: false });
                setReload(!reload);
                toast.success('قطعه  با موفقیت حذف شد');
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
        <PartWrapper error={errors?.type?.message}>
            <PagesHeader
                buttonTitle='ثبت قطعه جدید'
                secondFiled='ساعت کاری مجموعه : ۸ ساعت'
                hasFilter={true}
                onFilterClick={() => setShowFilterModal(true)}
                onButtonClick={addModalHandler}
            />
            <Table columns={columns} rows={stationData} pageStatus={pageStatus} setPageStatus={setPageStatus} loading={loader} />
            <Modal state={showFilterModal} setState={setShowFilterModal} maxWidth='sm'>
                <FilterModal setReload={setReload} setShowFilterModal={setShowFilterModal} />
                <FormButton text='حذف فیلتر' type='button' onClick={()=>{navigate("/parts" && setShowFilterModal(false))}} padding="1rem" backgroundColor='#174787' color='white' />
            </Modal>
            <Modal state={modalOpen} setState={setModalOpen} handleClose={closeModalFunctions} bgStatus={true}>
                <div className='formControl'>
                    {modalStatus === 'add' && (
                        <Tabs value={tabValue} onChange={handleChange} sx={{ margin: '40px 0 60px 0' }}>
                            <Tab label='ارسال تکی' sx={{ flexGrow: 1, fontWeight: 700, fontSize: 16 }} />
                            <Tab label='ارسال گروهی' sx={{ flexGrow: 1, fontWeight: 700, fontSize: 16 }} />
                        </Tabs>
                    )}
                    {modalStatus === 'add' ? <h2>فرم ثبت قطعه</h2> : <h2>ویرایش قطعه</h2>}
                    {tabValue === 0 ? (
                        <form onSubmit={handleSubmit(formSubmit)}>
                            <InputComponent
                                title='نام قطعه'
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
                                placeHolder='نام قطعه'
                            />
                            <InputComponent
                                title='کد قطعه'
                                icon={document}
                                detail={{
                                    ...register('code', {
                                        required: {
                                            value: true,
                                            message: 'این فیلد اجباری است'
                                        }
                                    })
                                }}
                                error={errors?.code}
                                placeHolder='کد قطعه'
                            />
                            <div className='auto_complete_wrapper'>
                                <p className='auto_complete_title'>برند</p>
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
                        </form>)
                        :
                        (
                            <>
                                <a
                                    href={xlsx}
                                    target='_blank'
                                    download
                                    rel='noreferrer'
                                    style={{ marginBottom: '20px', color: '#1C274C', display: 'inline-block' }}
                                >
                                    دانلود نمونه فایل اکسل
                                </a>
                                <UploadFile
                                    title={'قطعات'}
                                    setReload={setReload}
                                    setIsModalOpen={setModalOpen}
                                    setSpecificDeviationId={setSpecificDeviationId}
                                    setTabValue={setTabValue}
                                />
                            </>
                        )
                    }
                </div>
            </Modal>
            <ConfirmModal
                status={confirmModalStatus}
                setStatus={setConfirmModalStatus}
                title='آیا از حذف این ردیف مطمئن هستید ؟'
                deleteHandler={deleteHandler}
                loading={buttonLoader.delete}
            />
        </PartWrapper>
    );
};

export default Part;
