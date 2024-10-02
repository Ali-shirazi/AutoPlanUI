/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Axios from '../../configs/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

//Assets
import trashBin from './../../assets/images/global/TrashBin.svg';
import pen from './../../assets/images/global/pen.svg';
import eye from './../../assets/images/global/Eye.svg';
import { ModalStyleBg } from './corrective.style';
import { ActionCell } from '../deviation/deviation.style';

//Components
import Table from '../../components/template/Table';
import PagesHeader from '../../components/template/pages-header';
import Modal from '../../components/template/modal';
import ProgressBar from '../../components/pages/corrective/progress-bar';
import FormButton from '../../components/form-groups/form-button';
import Problem from '../../components/pages/corrective/problem';
import Rootting from '../../components/pages/corrective/rootting';
import Action from '../../components/pages/corrective/action';
import ResponsibleForAction from '../../components/pages/corrective/ResponsibleForAction';
import ExecuteDate from '../../components/pages/corrective/execute-date';
import Result from '../../components/pages/corrective/result';
import Effective from '../../components/pages/corrective/effective';
import ShowAll from '../../components/pages/corrective/show-all';
import ConfirmModal from '../../components/template/confirm-modal';
import EffectiveResult from '../../components/pages/corrective/effective-result';

//Tools
import PERMISSION from '../../utils/permission.ts';
import tools from '../../utils/tools';

const Corrective = () => {
    const userPermissions = useSelector(state => state.User.info.permission);
    const [step, setStep] = useState(1);
    const [allDetail, setAllDetail] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [correctiveData, setCorrectiveData] = useState();
    const [confirmModalStatus, setConfirmModalStatus] = useState(false);
    const [chosenEditItemDetails, setChosenEditItemDetails] = useState();
    const [DetailsIsModalOpen, setDetailsIsModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [loader, setLoader] = useState(true);
    const [specificDeviationId, setSpecificDeviationId] = useState();
    // const [stage, setStage] = useState([]);

    const [buttonLoader, setButtonLoader] = useState({
        delete: false
    });

    const [pageStatus, setPageStatus] = useState({
        total: 1,
        current: 1
    });

    const date = new Date();
    const today = tools.changeDateToJalali(date, false);

    const columns = [
        { id: 1, title: 'ردیف', key: 'index' },
        {
            id: 2, title: 'وضعیت ', key: 'status',
            renderCell: data => (
                <div style={{width: "10rem",display: "flex",justifyContent: "center",alignItems: "center"}}>
                    {(data.stage == 1 ? <div style={{ width: '30px', height: '30px', backgroundColor: '#C80036', borderRadius: '60px' }} /> : data.stage == 2 ? <div style={{ width: '30px', height: '30px', backgroundColor: '#FFB200', borderRadius: '60px' }} /> : data.stage == 3 ? <div style={{ width: '30px', height: '30px', backgroundColor: '#36BA98', borderRadius: '60px' }} /> : '')}
                </div>
            )
        },
        { id: 3, title: 'ایراد اعلام شده', key: 'problem' },
        
        {
            id: 4,
            title: 'مسئول',
            key: 'action_officials',
            renderCell: data => (
                <div className='action_officials_field'>
                    {data?.action_officials_info?.map((item, index) => (
                        <p key={`action_officials_${index}`}>{item.title} ,</p>
                    ))}
                </div>
            )
        },
        {
            id: 5,
            title: 'عملیات',
            key: 'actions',
            renderCell: data => (
                <ActionCell>
                    <FormButton
                        icon={eye}
                        onClick={() => {
                            setDetailsIsModalOpen(true);
                            setChosenEditItemDetails(data);
                        }}
                    />
                    <FormButton
                        icon={pen}
                        onClick={() => {
                            setIsModalOpen(true);
                            setChosenEditItemDetails(data);
                        }}
                        disabled={!userPermissions.includes(PERMISSION.CORRECTIVE_ACTION.EDIT)}
                    />
                    <FormButton
                        icon={trashBin}
                        onClick={() => deleteModalHandler(data.id)}
                        disabled={!userPermissions.includes(PERMISSION.CORRECTIVE_ACTION.DELETE)}
                    />
                </ActionCell>
            )
        },
        

    ];
    const getCorrectives = async () => {
        try {
            const res = await Axios.get(`normaluser/corrective-action/list_create/?page=${pageStatus.current}`);
            const updatedCorrectives = res.data.results.map(item => {
                if (item.control_completion_date && item.effectiveness_result) {
                    return { ...item, stage: 3 };
                } else if (item.control_completion_date) {
                    return { ...item, stage: 2 };
                } else {
                    return { ...item, stage: 1 };
                }
            });
            setCorrectiveData(updatedCorrectives);
            setPageStatus(prevStatus => ({
                ...prevStatus,
                total: res?.data?.count/ 15 < 1 ? "1" : Math.ceil(res?.data?.count/ 15)
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        setLoader(true);
        getCorrectives();
    }, [reload, pageStatus.current]);

    // useEffect(() => {
    //     console.log(correctiveData, "tttttttttt3");
    // }, [correctiveData]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const deleteHandler = () => {
        setButtonLoader({ ...buttonLoader, delete: true });
        Axios.delete(`normaluser/corrective-action/retrieve_update_destroy/${specificDeviationId}/`)
            .then(() => {
                setButtonLoader({ ...buttonLoader, delete: false });
                setReload(!reload);
                toast.success('اقدام اصلاحی  با موفقیت حذف شد');
                setConfirmModalStatus(false);
                setPageStatus({
                    ...pageStatus,
                    current: 1
                });
            })
            .catch(() => { });
    };

    const deleteModalHandler = id => {
        setConfirmModalStatus(true);
        setSpecificDeviationId(id);
    };

    return (
        <>
            <PagesHeader
                buttonTitle='اقدام اصلاحی'
                onButtonClick={openModal}
                disabled={!userPermissions.includes(PERMISSION.CORRECTIVE_ACTION.ADD)}
            />
            <Table columns={columns} rows={correctiveData} pageStatus={pageStatus} setPageStatus={setPageStatus} loading={loader} />
            <Modal
                state={isModalOpen}
                setState={setIsModalOpen}
                maxWidth='lg'
                bgStatus='true'
                handleClose={() => {
                    setStep(1);
                    setChosenEditItemDetails();
                    setAllDetail();
                }}
            >
                {isModalOpen ? (
                    <ModalStyleBg>
                        <h2>اقدام اصلاحی</h2>
                        <ProgressBar step={step} />
                        {step === 1 ? (
                            <Problem
                                setStep={setStep}
                                setAllDetail={setAllDetail}
                                chosenEditItemDetails={chosenEditItemDetails}
                                allDetail={allDetail}
                            />
                        ) : step === 2 ? (
                            <Rootting
                                setStep={setStep}
                                setAllDetail={setAllDetail}
                                chosenEditItemDetails={chosenEditItemDetails}
                                allDetail={allDetail}
                            />
                        ) : step === 3 ? (
                            <Action
                                setStep={setStep}
                                setAllDetail={setAllDetail}
                                chosenEditItemDetails={chosenEditItemDetails}
                                allDetail={allDetail}
                            />
                        ) : step === 4 ? (
                            <ResponsibleForAction
                                setStep={setStep}
                                setAllDetail={setAllDetail}
                                allDetail={allDetail}
                                chosenEditItemDetails={chosenEditItemDetails}
                            />
                        ) : step === 5 ? (
                            <ExecuteDate
                                setStep={setStep}
                                setAllDetail={setAllDetail}
                                allDetail={allDetail}
                                setIsModalOpen={setIsModalOpen}
                                chosenEditItemDetails={chosenEditItemDetails}
                                today={today}
                                setReload={setReload}
                            />
                        ) : step === 6 ? (
                            <Result
                                setStep={setStep}
                                setAllDetail={setAllDetail}
                                chosenEditItemDetails={chosenEditItemDetails}
                                allDetail={allDetail}
                            />
                        ) : step === 7 ? (
                            <Effective
                                setStep={setStep}
                                setAllDetail={setAllDetail}
                                chosenEditItemDetails={chosenEditItemDetails}
                                setReload={setReload}
                                allDetail={allDetail}
                                today={today}
                                setIsModalOpen={setIsModalOpen}
                            />
                        ) : (
                            step === 8 && (
                                <EffectiveResult
                                    setStep={setStep}
                                    setAllDetail={setAllDetail}
                                    setReload={setReload}
                                    chosenEditItemDetails={chosenEditItemDetails}
                                    setIsModalOpen={setIsModalOpen}
                                    allDetail={allDetail}
                                />
                            )
                        )}
                    </ModalStyleBg>
                ) : null}
            </Modal>
            <ConfirmModal
                status={confirmModalStatus}
                setStatus={setConfirmModalStatus}
                title='آیا از حذف این ردیف مطمئن هستید ؟'
                deleteHandler={deleteHandler}
                loading={buttonLoader.delete}
            />
            <Modal
                state={DetailsIsModalOpen}
                setState={setDetailsIsModalOpen}
                maxWidth='lg'
                handleClose={() => {
                    setChosenEditItemDetails();
                }}
            >
                <ShowAll chosenEditItemDetails={chosenEditItemDetails} today={today} />
            </Modal>
        </>
    );
};

export default Corrective;
