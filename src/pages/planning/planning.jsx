/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Axios from '../../configs/axios';
import { useSelector } from 'react-redux';
import PERMISSION from '../../utils/permission.ts';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment-jalaali';

//Assets
import { PlanningField } from './planning.style';
import pen from './../../assets/images/global/pen.svg';
import postponed from './../../assets/images/global/postponed.png';
import { ActionCell } from '../deviation/deviation.style';
import eye from './../../assets/images/global/Eye.svg';

//Components
import Table from '../../components/template/Table';
import PagesHeader from '../../components/template/pages-header';
import Modal from '../../components/template/modal';
import ProgressBar from '../../components/pages/planning/progress-bar';
import FilterModal from '../../components/pages/planning/filter-modal';
import CarDetail from '../../components/pages/planning/car-detail';
import Diagnosis from '../../components/pages/planning/diagnosis';
import Time from '../../components/pages/planning/time';
import FormButton from '../../components/form-groups/form-button';
// import ConfirmModal from '../../components/template/confirm-modal';

// Tools
import tools from '../../utils/tools';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import ModalForPlanning from '../../components/template/modalForPlanning.jsx';
import ShowAllForPlanning from '../../components/pages/planning/showAllForPlanning.jsx';

const Planning = () => {
    const userPermissions = useSelector(state => state.User.info.permission);
    const [modalIsOpen, setIsModalOpen] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [Step1Id, setStep1Id] = useState();
    const [Step2Id, setStep2Id] = useState();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [step, setStep] = useState(1);
    const [planningList, setPlanningList] = useState();
    const [reload, setReload] = useState(false);
    const [modalFormStatus, setModalFormStatus] = useState('add');
    const [confirmModalStatus, setConfirmModalStatus] = useState(false);
    const [chosenEditItemDetails, setChosenEditItemDetails] = useState();
    const [manufactureId, setManufactureId] = useState();
    const [deflection, setDeflection] = useState();
    const [whichDiagnosis, setWhichDiagnosis] = useState();
    const [diagnosisVehicleList, setDiagnosisVehicleList] = useState();
    // const [diagnosislist,setDiagnosislist] = useState()
    const [DetailsIsModalOpen, setDetailsIsModalOpen] = useState(false);
    const [selectedID, setSelectedID] = useState();
    const [isworker, setIsworker] = useState(false);
    const [pageStatus, setPageStatus] = useState({
        total: 1,
        current: 1
    });

    const [timetotroubleshoot, setTimetotroubleshoot] = useState([]);
    // const [diagnosisinfo, setDiagnosisinfo] = useState([]);


    const [searchParams] = useSearchParams();

    const openModal = () => {
        setIsModalOpen(true);
        setModalFormStatus('add');
    };

    const postponedToTomorow = data => {
        const tomorow = moment(data.date, 'jYYYY-jMM-jDD').add(1, 'day').format('jYYYY-jMM-jDD');
        Axios.patch(`normaluser/vehicle-specifications/retrieve_update/${data.id}/`, { date: tomorow })
            .then((res) => {
                // console.log(res);
                setReload(prev => !prev);
            });
    };



    useEffect(() => {
        Axios.get("normaluser/time-to-troubleshoot/list_create/").then((res) => {
            setTimetotroubleshoot([...timetotroubleshoot, ...res.data.results]);
        }).catch(() => { })
            .finally();
        // console.log(timetotroubleshoot, 'timetotroubleshoot');
        // console.log("timeto", timetotroubleshoot);
        Axios.get("accounts/profile/").then((res) => {
            // console.log(res.data, "profiles");
            res?.data?.role === "Worker" ? setIsworker(true) : setIsworker(false);

        }).catch(() => { })
            .finally();
        console.log(Step1Id, Step2Id, "wwwwww");
    }, [])

    useEffect(() => {
        setTableLoading(true);
        setPlanningList();

        const dateQuery = searchParams.get('date');
        const typeIdQuery = searchParams.get('type_id');
        const personnelIdQuery = searchParams.get('personnel_id');

        // setPageStatus(prev => ({
        //     ...prev,
        //     current: 1
        // }));



        Axios.get(`normaluser/vehicle-specifications/list_create/?page=${pageStatus.current}`, {
            params: {
                ...(dateQuery && {
                    date: dateQuery
                }),
                ...(typeIdQuery && {
                    type_id: typeIdQuery
                }),
                ...(personnelIdQuery && {
                    personnel_id: personnelIdQuery
                })
            }
        })
            .then(res => {
                // console.log(res, "rrrrrr");
                let planningList = {};
                let diagnosisVehicleList = {};
                // console.log(res.data, "diagnosisList");
                res.data.results.forEach(pl => {
                    planningList[pl.id] = 0;
                    diagnosisVehicleList[pl.id] = pl.diagnosis_info?.[0];
                })
                // console.log(res.data.results, 'pppppppppppp');
                setPlanningList(res.data.results);
                setWhichDiagnosis(planningList);
                // console.log(whichDiagnosis,"DetailsModal");
                setDiagnosisVehicleList(diagnosisVehicleList);
                setPageStatus({
                    ...pageStatus,
                    total: res?.data?.count / 15 < 1 ? "1" : Math.ceil(res?.data?.count / 15)
                });
            })
            .catch(() => { })
            .finally(() => setTableLoading(false));




    }, [reload, pageStatus.current, searchParams]);

    // console.log(timetotroubleshoot, 'timeto2');
    // console.log(whichDiagnosis, "whichset");
    // console.log("plann", planningList);

    const date = new Date();
    const today = tools.changeDateToJalali(date, false).replaceAll('/', '-');

    const columns = [
        { id: 1, title: 'ردیف', key: 'index' },
        { id: 3, title: 'تاریخ برنامه', key: 'date' },
        {
            id: 4,
            title: 'مشخصات خودرو و تحویل دهنده',
            key: 'car_brand',
            renderCell: data =>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                }}>
                    <div>{!data?.car_brand || data?.car_brand === '' ? 'تعریف نشده' : data?.car_brand}-{!data?.car_model || data?.car_model === '' ? 'تعریف نشده' : data?.car_model}</div>
                    <div className='plaque'>
                        <span>{data?.plaque_1}</span>
                        <span>{data?.plaque_2}</span>
                        <span>{data?.plaque_3}</span>
                        <span>-</span>
                        <span>{data?.plaque_4}</span>
                    </div>
                    <div>{!data?.customer_name || data?.customer_name === '' ? 'تعریف نشده' : data?.customer_name}-{!data?.customer_mobile_number || data?.customer_mobile_number === '' ? 'تعریف نشده' : data?.customer_mobile_number}</div>
                </Box>
        },
        // {
        //     id: 5,
        //     title: 'مدل خودرو',
        //     key: 'car_model',
        //     renderCell: data => <div>{!data?.car_model || data?.car_model === '' ? 'تعریف نشده' : data?.car_model}</div>
        // },
        // {
        //     id: 6,
        //     title: 'تحویل دهنده',
        //     key: 'customer_name',
        //     renderCell: data => <div>{!data?.customer_name || data?.customer_name === '' ? 'تعریف نشده' : data?.customer_name}-{!data?.customer_mobile_number || data?.customer_mobile_number === '' ? 'تعریف نشده' : data?.customer_mobile_number}</div>
        // },
        // {
        //     id: 7,
        //     title: 'موبایل',
        //     key: 'customer_mobile_number',
        //     renderCell: data => (
        //         <div>
        //             {!data?.customer_mobile_number || data?.customer_mobile_number === '' ? 'تعریف نشده' : data?.customer_mobile_number}
        //         </div>
        //     )
        // },
        {
            id: 2,
            title: 'وضعیت',
            key: 'status',
            renderCell: data => <div>
                {

                    (

                        data?.time_to_troubleshoot_info[whichDiagnosis[data?.id]]?.exact_start_time != null && data?.time_to_troubleshoot_info[whichDiagnosis[data?.id]]?.exact_end_time != null ? <div style={{ width: '100px', height: '30px', backgroundColor: '#50B498', padding: "6px", textAlign: "center", borderRadius: '10px' }}>مرحله 3</div> :
                            data?.diagnosis_info[0]?.approximate_end_time != null && data?.diagnosis_info[0]?.approximate_start_time != null ?
                                <div style={{ width: '100px', height: '30px', backgroundColor: '#FAFFAF', padding: "6px", textAlign: "center", borderRadius: '10px' }}>مرحله 2</div>
                                : <div style={{ width: '100px', height: '30px', backgroundColor: '#7FA1C3', padding: "6px", textAlign: "center", borderRadius: '10px' }}>مرحله 1</div>
                    )
                }
            </div>
        },
        {
            id: 8,
            title: 'عملیات',
            key: 'actions',
            renderCell: data => {
                // const createdDate = data?.create_at.slice(0, 10);
                const isMatch = data?.time_to_troubleshoot_info[whichDiagnosis[data?.id]]?.exact_start_time != null && data?.time_to_troubleshoot_info[whichDiagnosis[data?.id]]?.exact_end_time != null && data?.diagnosis_info?.length == data?.time_to_troubleshoot_info?.length && data?.time_to_troubleshoot_info[data?.time_to_troubleshoot_info?.length - 1]?.exact_end_time != null
                // console.log(isMatch,"editing");
                return (
                    <div className='actionContainer'>
                        {!isworker ? (
                            <>
                                <Typography>
                                    ویرایش
                                </Typography>
                                <ActionCell>
                                    <FormButton
                                        icon={pen}
                                        onClick={() => {
                                            setIsModalOpen(true);
                                            setModalFormStatus('edit');
                                            setChosenEditItemDetails(data);
                                        }}
                                        disabled={
                                            isMatch
                                        }
                                    />
                                </ActionCell>
                                <Typography>
                                    مشاهده
                                </Typography>
                                <ActionCell>
                                    <FormButton
                                        icon={eye}
                                        onClick={() => {
                                            setDetailsIsModalOpen(true);
                                            setSelectedID(data.id);
                                        }}
                                    />
                                </ActionCell>
                            </>
                        ) : (
                            <>
                                <Typography>
                                    ویرایش زمان
                                </Typography>
                                <ActionCell>
                                    <FormButton
                                        icon={pen}
                                        onClick={() => {
                                            setIsModalOpen(true);
                                            setModalFormStatus('edit');
                                            setChosenEditItemDetails(data);
                                            setStep(3);
                                        }}
                                        disabled={
                                            isMatch
                                        }
                                    />
                                </ActionCell>
                            </>
                        )


                        /* <ActionCell>
                            <FormButton
                                icon={postponed}
                                iconSize={30}
                                onClick={() => {
                                    postponedToTomorow(data);
                                }}
                                disabled={
                                    isMatch
                                }
                            />
                        </ActionCell> */}

                    </div>
                );
            }
        },
        // {
        //     id: 9,
        //     title: 'پلاک خودرو',
        //     key: 'plate_number',
        //     renderCell: data => (
        //         <div className='plaque'>
        //             <span>{data?.plaque_1}</span>
        //             <span>{data?.plaque_2}</span>
        //             <span>{data?.plaque_3}</span>
        //             <span>-</span>
        //             <span>{data?.plaque_4}</span>
        //         </div>
        //     )
        // },
        {
            id: 10,
            title: 'نوع تعمیر',
            key: 'type_of_repair',
            renderCell: data => (
                <div>
                    {!data?.diagnosis_info || !data?.diagnosis_info?.[0]?.type_of_repair || data?.diagnosis_info?.[0]?.type_of_repair === ''
                        ? 'تعریف نشده' :
                        <Select size='small' value={whichDiagnosis[data.id]} onChange={(e) => setWhichDiagnosis({ ...whichDiagnosis, ...{ [data.id]: e.target.value } })} >
                            {
                                data?.diagnosis_info?.map((item, index) => (
                                    <MenuItem key={index} value={index}>
                                        {item?.type_of_repair}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                        //  data?.diagnosis_info[0]?.type_of_repair}
                    }
                </div>
            )
        },
        // {
        //     id: 11,
        //     title: 'نام تعمیرکار',
        //     key: 'repairman',
        //     renderCell: data => (
        //         <div>
        //             {!data?.diagnosis_info[whichDiagnosis[data.id]]?.repairman_info?.user_info?.personnel?.fullname ||
        //                 data?.diagnosis_info[whichDiagnosis[data.id]]?.repairman_info?.user_info?.personnel?.fullname === ''
        //                 ? 'تعریف نشده'
        //                 : data?.diagnosis_info[whichDiagnosis[data.id]]?.repairman_info?.user_info?.personnel?.fullname}
        //         </div>
        //     )
        // },
        // {
        //     id: 12,
        //     title: 'جایگاه',
        //     key: 'station',
        //     renderCell: data => (
        //         <div>
        //             {!data?.diagnosis_info[whichDiagnosis[data.id]]?.repairman || data?.diagnosis_info[whichDiagnosis[data.id]]?.repairman === ''
        //                 ? 'تعریف نشده'
        //                 : data?.diagnosis_info[whichDiagnosis[data.id]]?.repairman}
        //         </div>
        //     )
        // },
        // {
        //     id: 13,
        //     title: 'زمان شروع تقریبی',
        //     key: 'estimated_start_repair_time',
        //     renderCell: data => (
        //         <div>
        //             {!data?.diagnosis_info[whichDiagnosis[data.id]]?.approximate_start_time || data?.diagnosis_info[whichDiagnosis[data.id]]?.approximate_start_time === ''
        //                 ? 'تعریف نشده'
        //                 : data?.diagnosis_info[whichDiagnosis[data.id]]?.approximate_start_time.split("+")[0]}
        //         </div>
        //     )
        // },
        // {
        //     id: 14,
        //     title: 'زمان پایان تقریبی',
        //     key: 'estimated_end_repair_time',
        //     renderCell: data => (
        //         <div>
        //             {!data?.diagnosis_info[whichDiagnosis[data.id]]?.approximate_end_time || data?.diagnosis_info[whichDiagnosis[data.id]]?.approximate_end_time === ''
        //                 ? 'تعریف نشده'
        //                 : data?.diagnosis_info[whichDiagnosis[data.id]]?.approximate_end_time.split("+")[0]}
        //         </div>
        //     )
        // },
        // {
        //     id: 15,
        //     title: 'زمان شروع واقعی',
        //     key: 'exact_start_time',
        //     renderCell: data => (
        //         <div>
        //             {!data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.exact_start_time || data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.exact_start_time === ''
        //                 ? 'تعریف نشده'
        //                 : data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.exact_start_time.split("+")[0]}
        //         </div>
        //     )
        // },
        // {
        //     id: 16,
        //     title: 'زمان پایان واقعی',
        //     key: 'exact_end_time',
        //     renderCell: data => (
        //         <div>
        //             {!data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.exact_end_time || data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.exact_end_time === ''
        //                 ? 'تعریف نشده'
        //                 : data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.exact_end_time.split("+")[0]}
        //         </div>
        //     )
        // },
        // {
        //     id: 17,
        //     title: 'تعجیل در شروع',
        //     key: 'start_with_haste',
        //     renderCell: data => (
        //         <div>
        //             {!data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.start_with_haste || data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.start_with_haste === ''
        //                 ? 'نداشته است'
        //                 : data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.start_with_haste}
        //         </div>
        //     )
        // },
        // {
        //     id: 18,
        //     title: 'تعجیل در پایان',
        //     key: 'end_with_haste',
        //     renderCell: data => (
        //         <div>
        //             {!data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.end_with_haste || data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.end_with_haste === ''
        //                 ? 'نداشته است'
        //                 : data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.end_with_haste}
        //         </div>
        //     )
        // },
        // {
        //     id: 19,
        //     title: 'تاخیر در شروع',
        //     key: 'delayed_start',
        //     renderCell: data => (
        //         <div>
        //             {!data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.delayed_start || data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.delayed_start === ''
        //                 ? 'نداشته است'
        //                 : data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.delayed_start}
        //         </div>
        //     )
        // },
        // {
        //     id: 20,
        //     title: 'تاخیر در پایان',
        //     key: 'delayed_end',
        //     renderCell: data => (
        //         <div>
        //             {!data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.delayed_end || data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.delayed_end === 'نداشته است'
        //                 ? 'تعریف نشده'
        //                 : data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.delayed_end}
        //         </div>
        //     )
        // },
        // {
        //     id: 21,
        //     title: 'علت انحراف',
        //     key: 'the_reason_for_the_deviation',
        //     renderCell: data => (
        //         <div>
        //             {!data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.the_reason_for_the_deviation_info?.reason ||
        //                 data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.the_reason_for_the_deviation_info?.reason === ''
        //                 ? 'نداشته است'
        //                 : data?.time_to_troubleshoot_info[whichDiagnosis[data.id]]?.the_reason_for_the_deviation_info?.reason}
        //         </div>
        //     )
        // },


    ];

    // const confirmModalHandler = () => {
    //     Axios.post(`normaluser/time-to-troubleshoot/automatic-alculation/?pk=${deflection}`)
    //         .then(() => {
    //             setConfirmModalStatus(false);
    //         })
    //         .catch(() => { })
    //         .finally(() => {
    //             setReload(!reload);
    //         });
    // };

    return (
        <PlanningField>
            <PagesHeader
                buttonTitle='ثبت برنامه جدید'
                onButtonClick={openModal}
                hasFilter={true}
                onFilterClick={() => setShowFilterModal(true)}
                disabled={!userPermissions.includes(PERMISSION.VEHICLE_SPECIFICATIONS.ADD_EDIT_VEHICLE_DETAILS)}
            />
            <Table columns={columns} rows={planningList} pageStatus={pageStatus} setPageStatus={setPageStatus} loading={tableLoading} />
            <Modal state={showFilterModal} setState={setShowFilterModal} maxWidth='sm'>
                <FilterModal setReload={setReload} setShowFilterModal={setShowFilterModal} />
            </Modal>
            <Modal
                state={modalIsOpen}
                setState={setIsModalOpen}
                bgStatus={true}
                handleClose={() => {
                    setModalFormStatus();
                    setChosenEditItemDetails();
                    setStep(1);
                }}
            >
                <div className='formControl'>
                    <h2>برنامه ریزی تعمیرات</h2>
                    <ProgressBar step={step} />
                    {step === 1 && (
                        <CarDetail
                            setStep={setStep}
                            setStep1Id={setStep1Id}
                            modalFormStatus={modalFormStatus}
                            chosenEditItemDetails={chosenEditItemDetails}
                            setReload={setReload}
                            setIsModalOpen={setIsModalOpen}
                            setManufactureId={setManufactureId}
                        />
                    )}
                    {step === 2 && (
                        <Diagnosis
                            setStep={setStep}
                            Step1Id={Step1Id}
                            setStep2Id={setStep2Id}
                            modalFormStatus={modalFormStatus}
                            chosenEditItemDetails={chosenEditItemDetails}
                            setReload={setReload}
                            manufactureId={manufactureId}
                            setIsModalOpen={setIsModalOpen}
                        />
                    )}
                    {step === 3 && (
                        <Time
                            setStep={setStep}
                            Step1Id={Step1Id}
                            Step2Id={Step2Id}
                            modalFormStatus={modalFormStatus}
                            chosenEditItemDetails={chosenEditItemDetails}
                            setReload={setReload}
                            setIsModalOpen={setIsModalOpen}
                            setConfirmModalStatus={setConfirmModalStatus}
                            setDeflection={setDeflection}
                            whichDiagnosis={whichDiagnosis}
                            isworker={isworker}
                        />
                    )}
                </div>
            </Modal>
            <ModalForPlanning
                maxWidth='lg'
                DetailsIsModalOpen={DetailsIsModalOpen}
                setDetailsIsModalOpen={setDetailsIsModalOpen}
            >
                <ShowAllForPlanning DetailsModal={planningList} whichDiagnosis={whichDiagnosis} selectedID={selectedID} />

            </ModalForPlanning>
            {/* <ConfirmModal
                status={confirmModalStatus}
                setStatus={setConfirmModalStatus}
                title='آیا میخواهید انحراف به صورت اتوماتیک محاسبه شود ؟'
                deleteHandler={confirmModalHandler}
                loading={false}
            />  */}
        </PlanningField>
    );
};

export default Planning;
