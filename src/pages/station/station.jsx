/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Axios from '../../configs/axios';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, Checkbox, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

//Assets
import trashBin from './../../assets/images/global/TrashBin.svg';
import pen from './../../assets/images/global/pen.svg';
import document from './../../assets/images/sideBar/DocumentAdd.svg';
import widget from './../../assets/images/sideBar/WidgetAdd.svg';
import { ActionCell } from '../deviation/deviation.style';
import { StationWrapper } from './station.style';
import plus from './../../assets/images/icons/plus.svg';
import closeIcon from './../../assets/images/global/closeIcon.svg';

//Components
import FormButton from '../../components/form-groups/form-button';
import PagesHeader from '../../components/template/pages-header';
import Table from '../../components/template/Table';
import Modal from '../../components/template/modal';
import InputComponent from '../../components/form-groups/input-component';
import ConfirmModal from '../../components/template/confirm-modal';

// Tools
import PERMISSION from '../../utils/permission.ts';

const Station = () => {
    const userPermissions = useSelector(state => state.User.info.permission);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('');
    const [confirmModalStatus, setConfirmModalStatus] = useState(false);
    const [typeList, setTypeList] = useState([]);
    const [stationData, setStationData] = useState();
    const [loader, setLoader] = useState(true);
    const [reload, setReload] = useState(false);
    const [specificDeviationId, setSpecificDeviationId] = useState();
    const [activeStation, setActiveStation] = useState(true);
    const [equipmentInputValue, setEquipmentInputValue] = useState('');
    const [equipmentArrays, setEquipmentArrays] = useState([]);
    const [equipmentsList, setEquipmentsList] = useState([]);
    const [buttonLoader, setButtonLoader] = useState({
        modalButton: false,
        delete: false
    });

    const [pageStatus, setPageStatus] = useState({
        total: 1,
        current: 1
    });

    const addInputEquipmentRef = useRef();

    const { register, control, handleSubmit, formState, reset, setValue, watch } = useForm({
        mode: 'onTouched'
    });
    const { errors } = formState;

    const equipmentStatus = watch('equipment_status');

    useEffect(() => {
        Axios.get('normaluser/equipment/list_create/').then(res => {
            setEquipmentsList(res.data.results.map(equ => equ?.name));
        });
    }, []);

    useEffect(() => {
        setLoader(true);
        Axios.get(`normaluser/seat-capacity/list_create/?page=${pageStatus.current}`)
            .then(res => {
                setStationData(res.data.results);
                setPageStatus({
                    ...pageStatus,
                    total: res?.data?.count/ 15 < 1 ? "1" : res?.data?.count / 15
                });
                setLoader(false);
            })
            .catch(() => { });
        Axios.get('normaluser/organizational-position/list_create/?page_size=500')
            .then(res => {
                let temp = [];

                res.data.results.map(item => {
                    if (item.technical_force) {
                        temp.push({
                            label: item.title,
                            value: item.id
                        });
                    }

                    return;
                });

                setTypeList(temp);
            })
            .catch(() => { });
    }, [pageStatus.current, reload]);

    const columns = [
        { id: 1, title: 'ردیف', key: 'index' },
        {
            id: 2,
            title: 'تاریخ',
            key: 'create_at'
        },
        { id: 4, title: 'کد', key: 'code' },
        { id: 5, title: 'وضعیت تجهیزات', key: 'equipment_status', renderCell: data => (data.equipment_status ? 'کامل' : 'ناقص') },
        {
            id: 6,
            title: 'نوع',
            key: 'type',
            renderCell: data => typeList.filter(item => item.value === data.type)[0]?.label
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
                        disabled={!userPermissions.includes(PERMISSION.SEAT_CAPACITY.EDIT)}
                    />
                    <FormButton
                        icon={trashBin}
                        onClick={() => deleteModalHandler(data.id)}
                        disabled={!userPermissions.includes(PERMISSION.SEAT_CAPACITY.DELETE)}
                    />
                </ActionCell>
            )
        }
    ];

    const formSubmit = data => {
        setButtonLoader({ ...buttonLoader, modalButton: true });

        const newData = {
            ...data,
            equipment_status: JSON.parse(data.equipment_status),
            list_of_equipment_status: data.list_of_equipment_status, //This should change
            station_status: JSON.parse(data?.equipment_status) || activeStation
        };

        if (modalStatus === 'add') {
            Axios.post('normaluser/seat-capacity/list_create/', newData)
                .then(() => {
                    setReload(!reload);
                    toast.success('جایگاه جدید با موفقیت ثبت شد');
                    setModalOpen(false);
                    closeModalFunctions();
                })
                .catch(() => { })
                .finally(() => setButtonLoader({ ...buttonLoader, modalButton: false }));
        } else {
            Axios.put(`normaluser/seat-capacity/retrieve_update_destroy/${specificDeviationId}/`, newData)
                .then(() => {
                    setReload(!reload);
                    toast.success('جایگاه با موفقیت ویرایش شد');
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
        setValue('code', data.code);
        setValue('type', data.type);
        setValue('equipment_status', data.equipment_status);
        // let found = equipmentsList.find(equ => equ.label === data.equipment)
        // let o = []
        // data.equipment_deficits.map(equ => equ.equipment).forEach(d => {
        //     o.push(JSON.parse(d));
        // })
        // const result = JSON.parse(data.equipment_deficits.map(equ => equ.equipment));
        setValue('list_of_equipment_status', data.equipment_deficits.map(equ => equ.equipment));
        //     id: uuidv4(),
        //     label: item.equipment
        // })),"whats this")
        /*         setEquipmentArrays(
                    data.equipment_deficits.map(item => ({
                        id: uuidv4(),
                        label: item.equipment
                    }))
                ); */
        setActiveStation(data.station_status);
        setSpecificDeviationId(data.id);
    };

    const deleteModalHandler = id => {
        setConfirmModalStatus(true);
        setSpecificDeviationId(id);
    };

    const addModalHandler = () => {
        setModalStatus('add');
        setModalOpen(true);
        setValue('equipment_status', true);
    };

    const deleteHandler = () => {
        setButtonLoader({ ...buttonLoader, delete: true });
        Axios.delete(`normaluser/seat-capacity/retrieve_update_destroy/${specificDeviationId}/`)
            .then(() => {
                setButtonLoader({ ...buttonLoader, delete: false });
                setReload(!reload);
                toast.success('جایگاه  با موفقیت حذف شد');
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
        setEquipmentArrays([]);
        setEquipmentInputValue('');
        setActiveStation(true);
        setSpecificDeviationId();
    };

    const addEquipmentHandler = () => {
        if (equipmentInputValue.trim()) {
            setEquipmentArrays(prev => [...prev, { id: uuidv4(), label: equipmentInputValue }]);
            setEquipmentInputValue('');
            addInputEquipmentRef.current.focus();
        }
    };

    return (
        <StationWrapper error={errors?.type?.message}>
            <PagesHeader
                buttonTitle='ثبت جایگاه جدید'
                secondFiled='ساعت کاری مجموعه : ۸ ساعت'
                onButtonClick={addModalHandler}
                disabled={!userPermissions.includes(PERMISSION.SEAT_CAPACITY.ADD)}
            />
            <Table columns={columns} rows={stationData} pageStatus={pageStatus} setPageStatus={setPageStatus} loading={loader} />
            <Modal state={modalOpen} setState={setModalOpen} handleClose={closeModalFunctions} bgStatus={true}>
                <div className='formControl'>
                    {modalStatus === 'add' ? <h2>فرم ثبت جایگاه</h2> : <h2>ویرایش جایگاه</h2>}
                    <form onSubmit={handleSubmit(formSubmit)}>
                        <div className='auto_complete_wrapper'>
                            <p className='auto_complete_title'>نوع</p>
                            <div className='auto_complete'>
                                <Controller
                                    control={control}
                                    name='type'
                                    rules={{ required: 'این فیلد اجباری است' }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Autocomplete
                                                options={typeList}
                                                value={typeList?.filter(item => item.value === value)[0]}
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
                        <InputComponent
                            title='کد'
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
                            placeHolder='کد'
                        />
                        <div className='radios'>
                            <p className='title'>وضعیت تجهیزات</p>
                            <Controller
                                control={control}
                                name='equipment_status'
                                render={({ field: { onChange, value } }) => (
                                    <RadioGroup row value={value} onChange={event => onChange(event.target.value)}>
                                        <FormControlLabel
                                            value={false}
                                            control={<Radio />}
                                            label='ناقص'
                                            sx={{ backgroundColor: 'transparent' }}
                                        />
                                        <FormControlLabel
                                            value={true}
                                            control={<Radio />}
                                            label='کامل'
                                            sx={{ backgroundColor: 'transparent' }}
                                        />
                                    </RadioGroup>
                                )}
                            />
                            <p className='error'>{errors?.equipmentStatus?.message}</p>
                        </div>

                        {(equipmentStatus === 'false' || equipmentStatus === false) && (
                            <>
                                {/*                                 <div className='choose_input'>
                                    <p className='choose_input_title'>نام تجهیزات</p>
                                    <div className='choose_input_wrapper'>
                                        <input
                                            type='text'
                                            className='choose_input_filed'
                                            placeholder='نام تجهیزات'
                                            ref={addInputEquipmentRef}
                                            value={equipmentInputValue}
                                            onChange={e => setEquipmentInputValue(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addEquipmentHandler();
                                                }
                                            }}
                                        />
                                        <FormButton icon={plus} width='fit-content' padding='5px' onClick={addEquipmentHandler} />
                                    </div>
                                </div> */}
                                <div className='auto_complete_wrapper'>
                                    <p className='auto_complete_title'>نام تجهیزات</p>
                                    <div className={errors?.equipment?.message ? 'auto_complete auto_complete_error' : 'auto_complete'}>
                                        <Controller
                                            control={control}
                                            name='list_of_equipment_status'
                                            rules={{ required: 'این فیلد اجباری است' }}
                                            render={({ field: { onChange, value } }) => {
                                                return (
                                                    <Autocomplete
                                                        options={equipmentsList}
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
                                    <p className='auto_complete_error_message'>{errors?.list_of_equipment_status?.message}</p>
                                </div>
                                {/*                                 <div className='options_array'>
                                    {equipmentArrays?.map(item => (
                                        <div
                                            className='options_wrapper'
                                            key={item.id}
                                            onClick={() => setEquipmentArrays(prev => prev.filter(filed => filed !== item))}
                                        >
                                            <p className='options_text'>{item.label}</p>
                                            <img src={closeIcon} className='options_img' />
                                        </div>
                                    ))}
                                </div>
 */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value={activeStation}
                                            onChange={e => setActiveStation(e.target.checked)}
                                            checked={activeStation}
                                        />
                                    }
                                    label='جایگاه فعال'
                                    sx={{ marginBottom: '30px' }}
                                />
                            </>
                        )}
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
        </StationWrapper>
    );
};

export default Station;
