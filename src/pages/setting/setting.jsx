/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import Axios from '../../configs/axios';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { infoHandler } from '../../store/reducers/user';

//Assets
import pen from './../../assets/images/global/pen.svg';
import { SettingWrapper } from './setting.style';
import document from './../../assets/images/sideBar/DocumentAdd.svg';
import notes from './../../assets/images/sideBar/Notes.svg';
import bill from './../../assets/images/sideBar/Bill.svg';
import homeSmile from './../../assets/images/sideBar/HomeSmile.svg';
import addPhone from './../../assets/images/login/addPhone.svg';

//Components
import PagesHeader from '../../components/template/pages-header';
import DetailBoxHeader from '../../components/template/detail-box-header';
import ReceptionForm from '../../components/pages/setting/reception-form';
import WorkTimeForm from '../../components/pages/setting/work-time-form';
import Modal from '../../components/template/modal';
import FormButton from '../../components/form-groups/form-button';
import InputComponent from '../../components/form-groups/input-component';
import { AddAdminWrapper } from '../add-admin/add-admin.style';
import NotAccessField from '../../components/template/not-access';

// Tools
import PERMISSION from '../../utils/permission.ts';
import { Link } from 'react-router-dom';

const Setting = () => {
    const userInfo = useSelector(state => state.User.info);
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);
    const { register, handleSubmit, formState, reset, setValue } = useForm({
        defaultValues: {
            company_address: '',
            company_code: '',
            company_name: '',
            company_owner: '',
            mobile_number: '',
            username: ''
        },
        mode: 'onTouched'
    });
    const { errors } = formState;

    const editModalHandler = () => {
        setModalOpen(true);
        setValue('fullname', userInfo.fullname);
        setValue('code', userInfo.company_code);
        setValue('title', userInfo.company_name);
        setValue('mobile_number', userInfo.mobile_number);
        setValue('address', userInfo.company_address);
        // console.log(userInfo.mobile_number);
    };
    // const formSubmit = data => {
    //     setButtonLoader(true);
    //     Axios.put(`accounts/representation/retrieve_update_destroy/${userInfo.company_id}/`, data)
    //         .then((res) => {
    //             console.log("putres",res.data);
    //             toast.success('اطلاعات نمایندگی با موفقیت ویرایش شد');
    //             setModalOpen(false);
    //             reset();
    //             Axios.get('accounts/profile/').then(res => {
    //                 console.log("rrrrrrr",res.data);
    //                 dispatch(infoHandler(res.data));
    //             });
    //         })
    //         .catch(() => {})
    //         .finally(() => {
    //             setButtonLoader(false);
    //         });
    // };

    return (
        <>
            <PagesHeader buttonTitle='نام نمایندگی : ' />
            <SettingWrapper>
                <Grid container spacing={1.5}>
                    <Grid item xs={12} md={6}>
                        <div className='item'>
                            {userInfo.permission.includes(PERMISSION.SETTING_RECEPTION.ADD) ||
                                userInfo.permission.includes(PERMISSION.SETTING_RECEPTION.EDIT) ||
                                userInfo.permission.includes(PERMISSION.SETTING_RECEPTION.LIST) ? (
                                <ReceptionForm />
                            ) : (
                                <NotAccessField />
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className='item'>
                            {userInfo.permission.includes(PERMISSION.REPRESENTATION_WORKING_TIME.ADD) ||
                                userInfo.permission.includes(PERMISSION.REPRESENTATION_WORKING_TIME.EDIT) ||
                                userInfo.permission.includes(PERMISSION.REPRESENTATION_WORKING_TIME.LIST) ? (
                                <WorkTimeForm />
                            ) : (
                                <NotAccessField />
                            )}
                        </div>
                        <br />
                        {userInfo.role === 'Admin' && (
                            <div className='item'>
                                <DetailBoxHeader
                                    title={`نام نمایندگی: ${userInfo.company_name}`}
                                    onClick={editModalHandler}
                                    buttonText={<img src={pen} />}
                                />
                            </div>
                        )}
                    </Grid>
                </Grid>
                <Modal state={modalOpen} setState={setModalOpen} handleClose={reset} bgStatus={true}>
                    <AddAdminWrapper>
                        <div className='formControl'>
                            <h2>مشاهده مشخصات نمایندگی</h2>
                            <div>
                                <p>در صورت تمایل به تغییرات در این بخش با <Link className='link-contact' to="/Contact-us"> پشتیبانی </Link>
                                    تماس بگیرید.</p>
                            </div>
                            <form
                            //  onSubmit={handleSubmit(formSubmit)}
                            >
                                <InputComponent
                                    title='نام کامل'
                                    icon={document}
                                    disabled
                                    detail={{
                                        ...register('fullname', {
                                            required: {
                                                value: true,
                                                message: 'این فیلد اجباری است'
                                            }
                                        })
                                    }}
                                    error={errors?.fullname}
                                    placeHolder='نام کامل'
                                />

                                <InputComponent
                                    title='کد نمایندگی'
                                    icon={notes}
                                    disabled
                                    detail={{
                                        ...register('code', {
                                            required: {
                                                value: true,
                                                message: 'این فیلد اجباری است'
                                            }
                                        })
                                    }}
                                    error={errors?.code}
                                    placeHolder='کد نمایندگی'
                                />

                                <InputComponent
                                    title='نام نمایندگی'
                                    icon={bill}
                                    disabled
                                    detail={{
                                        ...register('title', {
                                            required: {
                                                value: true,
                                                message: 'این فیلد اجباری است'
                                            }
                                        })
                                    }}
                                    error={errors?.title}
                                    placeHolder='نام نمایندگی'
                                />

                                <InputComponent
                                    title='شماره موبایل'
                                    type='tel'
                                    disabled
                                    icon={addPhone}
                                    detail={{
                                        ...register('mobile_number', {
                                            required: {
                                                value: true,
                                                message: 'این فیلد اجباری است'
                                            },
                                            maxLength: {
                                                value: 11,
                                                message: 'شماره باید ۱۱ عدد باشد'
                                            },
                                            minLength: {
                                                value: 11,
                                                message: 'شماره باید ۱۱ عدد باشد'
                                            }
                                        })
                                    }}
                                    maxLength={11}
                                    error={errors?.phone}
                                    placeHolder='---------۰۹'
                                />

                                <div className={errors?.address ? 'text_area text_area_error' : 'text_area'}>
                                    <p className='title'>آدرس نمایندگی</p>
                                    <div>
                                        <textarea
                                            disabled
                                            rows='5'
                                            placeholder='آدرس نمایندگی'
                                            {...register('address', {
                                                required: {
                                                    value: true,
                                                    message: 'این فیلد اجباری است'
                                                }
                                            })}
                                        ></textarea>
                                        <img src={homeSmile} />
                                    </div>
                                    <p className='error'>{errors?.address?.message}</p>
                                </div>

                                {/* <FormButton
                                    text='ویرایش'
                                    type='submit'
                                    backgroundColor='#174787'
                                    color={'white'}
                                    height={48}
                                    loading={buttonLoader}
                                    disabled={userInfo?.role !== 'Admin'}
                                /> */}
                            </form>
                        </div>
                    </AddAdminWrapper>
                </Modal>
            </SettingWrapper>
        </>
    );
};

export default Setting;
