/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Axios from '../../configs/axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

//Assets
import trashBin from './../../assets/images/global/TrashBin.svg';
import pen from './../../assets/images/global/pen.svg';
import document from './../../assets/images/sideBar/DocumentAdd.svg';
import { ActionCell } from '../deviation/deviation.style';
import { EquipWrapper } from './equip.style';

//Components
import FormButton from '../../components/form-groups/form-button';
import PagesHeader from '../../components/template/pages-header';
import Table from '../../components/template/Table';
import Modal from '../../components/template/modal';
import InputComponent from '../../components/form-groups/input-component';
import ConfirmModal from '../../components/template/confirm-modal';

const Equip = () => {
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

    const { register, control, handleSubmit, formState, reset, setValue, watch } = useForm({
        mode: 'onTouched'
    });
    const { errors } = formState;

    useEffect(() => {
        setLoader(true);
        Axios.get(`normaluser/equipment/list_create/?page=${pageStatus.current}`)
            .then(res => {
                setStationData(res.data.results);
                setPageStatus({
                    ...pageStatus,
                    total: res?.data?.count / 15 < 1 ? "1" : Math.ceil(res?.data?.count/ 15)
                });
                setLoader(false);
                console.log(res?.data, "ressssss");
            })
            .catch(() => { });
        Axios.get('normaluser/equipment/list_create/?page_size=50')
            .then(res => {
                let temp = [];
                console.log(res.data, "ressss");
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
        { id: 4, title: 'نام تجهیزات', key: 'name' },
        // {
        //     id: 6,
        //     title: 'نوع',
        //     key: 'type',
        //     renderCell: data => typeList.filter(item => item.value === data.type)[0]?.label
        // },
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
            ...data,
        };

        if (modalStatus === 'add') {
            Axios.post('normaluser/equipment/list_create/', newData)
                .then(() => {
                    setReload(!reload);
                    toast.success('تجهیزات جدید با موفقیت ثبت شد');
                    setModalOpen(false);
                    closeModalFunctions();
                })
                .catch((err) => {toast.error("تجهیزات قبلا ثبت شده است !") })
                .finally(() => setButtonLoader({ ...buttonLoader, modalButton: false }));
        } else {
            Axios.put(`normaluser/equipment/retrieve_update_destroy/${specificDeviationId}/`, newData)
                .then(() => {
                    setReload(!reload);
                    toast.success('تجهیزات با موفقیت ویرایش شد');
                    setModalOpen(false);
                    closeModalFunctions();
                })
                .catch((err) => {toast.error(err.message) })
                .finally(() => setButtonLoader({ ...buttonLoader, modalButton: false }));
        }
    };

    const editModalHandler = data => {
        setModalStatus('edit');
        setModalOpen(true);
        setValue('name', data.name);
        setSpecificDeviationId(data.id);
    };

    const deleteModalHandler = id => {
        setConfirmModalStatus(true);
        setSpecificDeviationId(id);
    };

    const addModalHandler = () => {
        setModalStatus('add');
        setModalOpen(true);
        setValue('equipment_status', false);
    };

    const deleteHandler = () => {
        setButtonLoader({ ...buttonLoader, delete: true });
        Axios.delete(`normaluser/equipment/retrieve_update_destroy/${specificDeviationId}/`)
            .then(() => {
                setButtonLoader({ ...buttonLoader, delete: false });
                setReload(!reload);
                toast.success('تجهیزات  با موفقیت حذف شد');
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

    return (
        <EquipWrapper error={errors?.type?.message}>
            <PagesHeader
                buttonTitle='ثبت تجهیزات جدید'
                secondFiled='ساعت کاری مجموعه : ۸ ساعت'
                onButtonClick={addModalHandler}
            />
            <Table columns={columns} rows={stationData} pageStatus={pageStatus} setPageStatus={setPageStatus} loading={loader} />
            <Modal state={modalOpen} setState={setModalOpen} handleClose={closeModalFunctions} bgStatus={true}>
                <div className='formControl'>
                    {modalStatus === 'add' ? <h2>فرم ثبت تجهیزات</h2> : <h2>ویرایش تجهیزات</h2>}
                    <form onSubmit={handleSubmit(formSubmit)}>
                        <InputComponent
                            title='نام تجهیزات'
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
                            placeHolder='نام تجهیزات'
                        />
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
        </EquipWrapper>
    );
};

export default Equip;
