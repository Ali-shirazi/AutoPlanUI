/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Axios from '../../configs/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

//Assets
import Bus from '../../assets/images/icons/Bus.svg';
import ShockAbsorber from '../../assets/images/icons/ShockAbsorber.svg';
import Accumulator from '../../assets/images/icons/Accumulator.svg';
import trashBin from './../../assets/images/global/TrashBin.svg';
import pen from './../../assets/images/global/pen.svg';
import { ActionCell } from '../deviation/deviation.style';
import xlsx from '../../assets/deficientexample.xlsx';

//Components
import Table from '../../components/template/Table';
import PagesHeader from '../../components/template/pages-header';
import Modal from '../../components/template/modal';
import InputComponent from '../../components/form-groups/input-component';
import FormButton from '../../components/form-groups/form-button';
import UploadFile from '../../components/form-groups/UploadFile';
import DatePickerComponent from '../../components/form-groups/date-picker';
import ConfirmModal from '../../components/template/confirm-modal';
// MUI
import { Autocomplete, TextField } from '@mui/material';

// Tools
import Tools from '../../utils/tools';
import PERMISSION from '../../utils/permission.ts';

// MUI
import { FormLabel, MenuItem, Select, Tab, Tabs } from '@mui/material';
import tools from '../../utils/tools';

const Deficiency = () => {
    const userPermission = useSelector(state => state.User.info.permission);
    const [modalIsOpen, setIsModalOpen] = useState(false);
    const [deficiencyData, setDeficiencyData] = useState();
    const [parts, setParts] = useState([]);
    const [reload, setReload] = useState(false);
    const [loader, setLoader] = useState(true);
    const [modalStatus, setModalStatus] = useState('');
    const [confirmModalStatus, setConfirmModalStatus] = useState(false);
    const [specificDeviationId, setSpecificDeviationId] = useState();
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (_, newValue) => {
        setTabValue(newValue);
    };

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
        { id: 2, title: 'تاریخ', key: 'date' },
        { id: 3, title: 'نام قطعه', key: 'name' },
        { id: 4, title: 'کد قطعه', key: 'code' },
        { id: 5, title: 'تعداد کسری', key: 'count' },
        {
            id: 6,
            title: 'عملیات',
            key: 'actions',
            renderCell: data => (
                <ActionCell>
                    <FormButton
                        icon={pen}
                        onClick={() => editModalHandler(data)}
                        disabled={!userPermission.includes(PERMISSION.LACK_PARTS.EDIT)}
                    />
                    <FormButton
                        icon={trashBin}
                        onClick={() => deleteModalHandler(data)}
                        disabled={!userPermission.includes(PERMISSION.LACK_PARTS.DELETE)}
                    />
                </ActionCell>
            )
        }
    ];

    const { register, watch, handleSubmit, formState, control, reset, setValue } = useForm({
        defaultValues: {
            date: '',
            count: '',
            part: '',
            // car_type: ''
        },
        mode: 'onTouched'
    });
    const { errors } = formState;

    useEffect(() => {
        Axios.get(`normaluser/part/list_create/`).then(res => {
            // console.log(res.data.results[0].create_at.split(" ")[0], "data def part");
            const partsData = res.data.results.map(r => ({
                id: r.id,
                create_at: r.create_at.split(" ")[0],
                name: r.name,
                code: r.code,
                date: r.update_at,
                count: r.count,
            }));
            setParts(partsData);
        })
    }, [])

    useEffect(() => {
        setLoader(true);
        Axios.get(`normaluser/lack-parts/list_create/?page=${pageStatus.current}`)
            .then(res => {
                // console.log(res.data, "data def");

                setDeficiencyData(res.data.results.map(r => ({
                    id: r.id,
                    count: r.count,
                    create_at: r.create_at,
                    name: r.part_info.name,
                    code: r.part_info.code,
                    date: r.update_at,
                    update_at:r.update_at
                })));
                setPageStatus(prev => ({
                    ...prev,
                    total: res?.data?.count/ 15 < 1 ? "1" : Math.ceil(res?.data?.count/ 15)
                }));
            })
            .catch(() => { })
            .finally(() => setLoader(false));
    }, [reload, pageStatus.current]);


    const addModalHandler = () => {
        setModalStatus('add');
        reset();
        setIsModalOpen(true);
    };

    const deleteModalHandler = data => {
        setConfirmModalStatus(true);
        // console.log(data, "deleteedit1");
        setSpecificDeviationId(data.id);
    };

    const editModalHandler = (data) => {
        // console.log(data, "deleteedit2");
        setModalStatus('edit');
        setIsModalOpen(true);
        setValue('date', tools.changeDateToTimeStamp(data.create_at.split(" ")[0]));
        setValue('count', data.count);
        // Set the equipment field to the part object, which matches the structure of the options in Autocomplete
        const part = parts.find(p => p.name === data.name);
        setValue('equipment', part);

        setSpecificDeviationId(data.id);
        // setSpecificDeviationId(data.id);
    };



    const formSubmit = (data) => {
        setButtonLoader((prev) => ({
            ...prev,
            modalButton: true,
        }));

        const newDate = {
            count: data.count,
            date: Tools.changeTimeStampToDate(data.date),
            part: data.equipment.id, // Send the part ID instead of the entire part object
        };

        // console.log('newDate', newDate);

        if (modalStatus === 'add') {
            Axios.post('normaluser/lack-parts/list_create/', newDate)
                .then(() => {
                    // console.log(newDate, "newDate");
                    setReload((prev) => !prev);
                    toast.success('کسری قطعات با موفقیت ثبت شد');
                    setIsModalOpen(false);
                    reset();
                })
                .catch(() => { })
                .finally(() => {
                    setButtonLoader((prev) => ({
                        ...prev,
                        modalButton: false,
                    }));
                });
        } else {
            Axios.put(`normaluser/lack-parts/retrieve_update_destroy/${specificDeviationId}/`, newDate)
                .then(() => {
                    setReload((prev) => !prev);
                    toast.success('کسری قطعات با موفقیت ویرایش شد');
                    setIsModalOpen(false);
                    reset();
                })
                .catch(() => { })
                .finally(() => {
                    setButtonLoader((prev) => ({
                        ...prev,
                        modalButton: false,
                    }));
                });
        }
    };



    const deleteHandler = () => {
        setButtonLoader(prev => ({
            ...prev,
            delete: true
        }));
        Axios.delete(`normaluser/lack-parts/retrieve_update_destroy/${specificDeviationId}/`)
            .then(() => {
                setReload(!reload);
                toast.success('کسری قطعه  با موفقیت حذف شد');
                setConfirmModalStatus(false);
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
                setSpecificDeviationId();
            });
    };

    return (
        <>
            <PagesHeader
                buttonTitle='اضافه کردن کسری قطعات'
                onButtonClick={addModalHandler}
                disabled={!userPermission.includes(PERMISSION.LACK_PARTS.ADD)}
            />
            <Table columns={columns} rows={deficiencyData} pageStatus={pageStatus} setPageStatus={setPageStatus} loading={loader} />
            <Modal
                state={modalIsOpen}
                setState={setIsModalOpen}
                maxWidth='sm'
                handleClose={() => {
                    reset();
                    setTabValue(0);
                }}
            >
                <h2> کسری قطعات </h2>
                {modalStatus === 'add' && (
                    <Tabs value={tabValue} onChange={handleChange} sx={{ margin: '40px 0 60px 0' }}>
                        <Tab label='ارسال تکی' sx={{ flexGrow: 1, fontWeight: 700, fontSize: 16 }} />
                        <Tab label='ارسال گروهی' sx={{ flexGrow: 1, fontWeight: 700, fontSize: 16 }} />
                    </Tabs>
                )}
                {tabValue === 0 ? (
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
                                return <DatePickerComponent value={value} onChange={onChange} title='انتخاب تاریخ' minDate={new Date()} error={errors?.date} />;
                            }}
                        />
                        {/* <FormLabel sx={{ color: 'rgba(0, 0, 0, 0.87)', fontWeight: '600' }}>
                            قطعه
                        </FormLabel> */}
                        {/* <Select size='small' sx={{backgroundColor: 'white'}} fullWidth value={selectedPart} onChange={(e) => setSelectedPart({ ...e.target.value })} >
                            {
                                parts.map((item, index) => (
                                    <MenuItem key={item.id} value={item}>
                                        {item?.name}
                                    </MenuItem>
                                ))
                            }
                        </Select> */}
                        {/* <div className='auto_complete_wrapper' style={{ width: '100%' }}>
                            <p className='auto_complete_title' style={{ color: 'rgba(0, 0, 0, 0.87)', fontWeight: '600' }}>قطعه</p>
                            <div className='auto_complete'>
                                <Controller
                                    control={control}
                                    name='part'
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'این فیلد اجباری است'
                                        }
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Autocomplete
                                                options={parts.length > 0 ? parts : []}
                                                value={value}
                                                getOptionLabel={option => option.name}
                                                onChange={(event, newValue) => {
                                                    onChange(newValue);
                                                }}
                                                error={errors?.part}
                                                sx={{ width: '100%', backgroundColor: 'white' }}
                                                renderInput={params => <TextField {...params} />}
                                            />
                                        );
                                    }}
                                />
                            </div>
                            <p style={{ color: '#830000', fontSize: '12px', marginTop: '10px' }}>{errors?.part?.message}</p>
                        </div> */}
                        <div className='auto_complete_wrapper'>
                            <p className='auto_complete_title'>نام قطعه</p>
                            <div className={errors?.part?.message ? 'auto_complete auto_complete_error' : 'auto_complete'}>
                                <Controller
                                    control={control}
                                    name='equipment'
                                    rules={{ required: 'این فیلد اجباری است' }}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            options={parts}
                                            getOptionLabel={(option) => option.name || ''}
                                            value={value || null}
                                            onChange={(event, newValue) => {
                                                onChange(newValue);
                                            }}
                                            sx={{ width: '100%' }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    )}
                                />
                            </div>
                            <p className='auto_complete_error_message'>{errors?.equipment?.message}</p>
                        </div>


                        <Controller
                            control={control}
                            name='count'
                            rules={{
                                required: {
                                    value: true,
                                    message: 'این فیلد اجباری است'
                                }
                            }}
                            render={({ field: { onChange, value } }) => {
                                return (
                                    <InputComponent
                                        title="تعداد"
                                        type="number"
                                        error={errors?.code}
                                        placeHolder='تعداد کسری'
                                        value={value}
                                        onChange={onChange}
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
                            title='نوع خودرو'
                            placeHolder='نوع خودرو'
                            type='text'
                            icon={Bus}
                            detail={{
                                ...register('car_type', {
                                    required: {
                                        value: true,
                                        message: 'این فیلد اجباری است'
                                    }
                                })
                            }}
                            error={errors?.car_type}
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
                ) : (
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
                            setReload={setReload}
                            setIsModalOpen={setIsModalOpen}
                            title={'کسری قطعات'}
                            setSpecificDeviationId={setSpecificDeviationId}
                            setTabValue={setTabValue}
                        />
                    </>
                )}
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

export default Deficiency;
