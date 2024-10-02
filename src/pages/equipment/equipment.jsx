/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Axios from '../../configs/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

//Assets
import ShockAbsorber from '../../assets/images/icons/ShockAbsorber.svg';
import trashBin from './../../assets/images/global/TrashBin.svg';
import pen from './../../assets/images/global/pen.svg';
import { ActionCell } from '../deviation/deviation.style';

//Components
import Table from '../../components/template/Table';
import PagesHeader from '../../components/template/pages-header';
import Modal from '../../components/template/modal';
import InputComponent from '../../components/form-groups/input-component';
import FormButton from '../../components/form-groups/form-button';
import DatePickerComponent from '../../components/form-groups/date-picker';
import ConfirmModal from '../../components/template/confirm-modal';

// Tools
import Tools from '../../utils/tools';
import PERMISSION from '../../utils/permission.ts';
import { Autocomplete, TextField } from '@mui/material';
import tools from '../../utils/tools';

const Equipment = () => {
    const userPermission = useSelector(state => state.User.info.permission);
    const [modalIsOpen, setIsModalOpen] = useState(false);
    const [deficiencyData, setDeficiencyData] = useState();
    const [reload, setReload] = useState(false);
    const [loader, setLoader] = useState(true);
    const [modalStatus, setModalStatus] = useState('');
    const [confirmModalStatus, setConfirmModalStatus] = useState(false);
    const [specificDeviationId, setSpecificDeviationId] = useState();
    const [equipments, setEquipments] = useState([]);

    const [buttonLoader, setButtonLoader] = useState({
        modalButton: false,
        delete: false
    });

    const [pageStatus, setPageStatus] = useState({
        total: 1,
        current: 1
    });

    const columns = [
        { id: 1, title: 'ردیف', key: 'index' },
        { id: 2, title: 'تاریخ', key: 'create_at' },
        { id: 3, title: 'نام تجهیزات', key: 'name' },
        { id: 4, title: "تعداد کسری", key: "count" },
        {
            id: 5,
            title: 'عملیات',
            key: 'actions',
            renderCell: data => (
                <ActionCell>
                    <FormButton
                        icon={pen}
                        onClick={() => editModalHandler(data)}
                        disabled={!userPermission.includes(PERMISSION.EQUIPMENT_SHORTAGE.EDIT)}
                    />
                    <FormButton
                        icon={trashBin}
                        onClick={() => deleteModalHandler(data)}
                        disabled={!userPermission.includes(PERMISSION.EQUIPMENT_SHORTAGE.DELETE)}
                    />
                </ActionCell>
            )
        }
    ];

    const { register, handleSubmit, formState, control, reset, setValue } = useForm({
        defaultValues: {
            date: '',
            count: '',
            equipment: '',
            // car_type: ''
        },
        mode: 'onTouched'
    });
    const { errors } = formState;

    useEffect(() => {
        Axios.get('normaluser/equipment/list_create/').then(res => {
            console.log(res?.data?.results, "equip");
            setEquipments(res.data.results.map(equ => {
                return {
                    date: equ.create_at,
                    id: equ.id,
                    label: equ.name,
                    create_at: equ.create_at,
                    update_at: equ.update_at,
                };
            }));
        });
    }, []);

    useEffect(() => {
        setLoader(true);
        Axios.get(`normaluser/equipment-deficit/list_create/?page=${pageStatus.current}`)
            .then(res => {
                // console.log(res?.data?.results, "equip defs");
                setDeficiencyData(res.data.results.map((r) => ({
                    create_at: r.create_at,
                    update_at: r.updated_at,
                    name: r.equipment_info.name,
                    count: r.count,
                    id:r.id
                })));
                setPageStatus({
                    ...pageStatus,
                    total: res?.data?.count/ 15 < 1 ? "1" : Math.ceil(res?.data?.count/ 15)
                });
            })
            .catch(() => { })
            .finally(() => setLoader(false));
    }, [reload, pageStatus.current]);

    const addModalHandler = () => {
        setModalStatus('add');
        setIsModalOpen(true);
    };

    const deleteModalHandler = data => {
        setConfirmModalStatus(true);
        console.log(data,"equipment del");
        setSpecificDeviationId(data.id);
    };

    const editModalHandler = data => {
        setModalStatus('edit');
        setIsModalOpen(true);
        setValue('date', tools.changeDateToTimeStamp(data.create_at.split(" ")[0]));
        setValue('count', data.count);
        console.log(equipments,"equipments");
        const found = equipments.find(p => p.label === data.name);
        setValue('equipment', found);
        setSpecificDeviationId(data.id);
    };

    const formSubmit = data => {
        setButtonLoader(prev => ({
            ...prev,
            modalButton: true
        }));

        const newData = {
            // ...data,
            equipment: data.equipment.id,
            // id: data.equipment.id,
            // name: data.equipment.label,
            date: Tools.changeTimeStampToDate(data.date),
            count: data.count
        };
        console.log(newData, "ndata");
        if (modalStatus === 'add') {
            Axios.post('normaluser/equipment-deficit/list_create/', newData)
                .then(() => {
                    setReload(prev => !prev);
                    toast.success('کسری تجهیزات با موفقیت ثبت شد');
                    setIsModalOpen(false);
                    reset();
                })
                .catch(() => { })
                .finally(() => {
                    setButtonLoader(prev => ({
                        ...prev,
                        modalButton: false
                    }));
                });
        } else {
            Axios.put(`normaluser/equipment-deficit/delete_update/${specificDeviationId}/`, newData)
                .then(() => {
                    setReload(prev => !prev);
                    toast.success('کسری تجهیزات با موفقیت ویرایش شد');
                    setIsModalOpen(false);
                    reset();
                })
                .catch(() => { })
                .finally(() => {
                    setButtonLoader(prev => ({
                        ...prev,
                        modalButton: false
                    }));
                });
        }
    };

    const deleteHandler = () => {
        setButtonLoader(prev => ({
            ...prev,
            delete: true
        }));

        Axios.delete(`normaluser/equipment-deficit/delete_update/${specificDeviationId}/`)
            .then(() => {
                setReload(!reload);
                toast.success('کسری قطعه  با موفقیت حذف شد');
                setConfirmModalStatus(false);
                setSpecificDeviationId();
                setPageStatus({
                    ...pageStatus,
                    current: 1
                });
            })
            .catch(() => { })
            .finally(() => {
                setButtonLoader(prev => ({
                    ...prev,
                    delete: false
                }));
            });
    };

    return (
        <>
            <PagesHeader
                buttonTitle='اضافه کردن کسری تجهیزات'
                onButtonClick={addModalHandler}
                disabled={!userPermission.includes(PERMISSION.EQUIPMENT_SHORTAGE.ADD)}
            />
            <Table columns={columns} rows={deficiencyData} pageStatus={pageStatus} setPageStatus={setPageStatus} loading={loader} />
            <Modal
                state={modalIsOpen}
                setState={setIsModalOpen}
                maxWidth='sm'
                handleClose={() => {
                    reset();
                }}
            >
                <h2> کسری تجهیزات </h2>
                <form onSubmit={handleSubmit(formSubmit)}>
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
                            return <DatePickerComponent minDate={new Date()} value={value} onChange={onChange} title='انتخاب تاریخ' error={errors?.date} />;
                        }}
                    />
                    <div className='auto_complete_wrapper'>
                        <p className='auto_complete_title'>نام تجهیزات</p>
                        <div className={errors?.equipment?.message ? 'auto_complete auto_complete_error' : 'auto_complete'}>
                            <Controller
                                control={control}
                                name='equipment'
                                rules={{ required: 'این فیلد اجباری است' }}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <Autocomplete
                                            options={equipments}
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
                        <p className='auto_complete_error_message'>{errors?.equipment?.message}</p>
                    </div>
                    <Controller
                        control={control}
                        name='equipment'
                        rules={{ required: 'این فیلد اجباری است' }}
                        render={({ field: { onChange, value } }) => {
                            return (
                                <InputComponent
                                    title="تعداد"
                                    type="number"
                                    error={errors?.code}
                                    value={value}
                                    onChange={onChange}
                                    placeHolder='تعداد کسری'
                                    detail={{
                                        ...register('count', {
                                            required: {
                                                value: true,
                                                message: 'این فیلد اجباری است'
                                            }
                                        })
                                    }}
                                />
                            );
                        }}
                    />
                    {/* <InputComponent
                        title='نام تجهیزات'
                        placeHolder='نام تجهیزات'
                        type='text'
                        icon={ShockAbsorber}
                        detail={{
                            ...register('equipment', {
                                required: {
                                    value: true,
                                    message: 'این فیلد اجباری است'
                                }
                            })
                        }}
                        error={errors?.equipment}
                    /> */}
                    <FormButton
                        text={modalStatus === 'edit' ? 'ویرایش' : 'ثبت'}
                        loading={buttonLoader.modalButton}
                        type='submit'
                        backgroundColor={'#174787'}
                        color={'white'}
                        height={48}
                    />
                </form>
            </Modal>

            <ConfirmModal
                status={confirmModalStatus}
                setStatus={setConfirmModalStatus}
                title='آیا از حذف این ردیف مطمئن هستید ؟'
                deleteHandler={deleteHandler}
                loading={buttonLoader.delete}
            />
        </>
    );
};

export default Equipment;
