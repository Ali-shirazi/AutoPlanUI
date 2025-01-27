/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Axios from '../../../configs/axios';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { infoHandler } from '../../../store/reducers/user';
import { useDispatch, useSelector } from 'react-redux';

//Assets
import { FormWrapper } from './work-time-form.style';
import brokenArrow from './../../../assets/images/global/brokenArrow.svg';

//Components
import FormButton from '../../form-groups/form-button';
import TimePicker from '../../form-groups/time-picker';

//Tools
import PERMISSION from '../../../utils/permission.ts';

const WorkTimeForm = () => {
    const userPermissions = useSelector(state => state.User.info.permission);
    const dispatch = useDispatch();
    const [buttonLoader, setButtonLoader] = useState(false);
    const [reload, setReload] = useState(false);
    const [getTime, setGetTime] = useState();
    const { register, handleSubmit, setValue, formState } = useForm({
        mode: 'onTouched'
    });
    const { errors } = formState;

    const formSubmit = data => {
        setButtonLoader(true);
        const newData = {
            start_time: `${data?.approximate_start_time_hour}:${data?.approximate_start_time_min}`,
            end_time: `${data?.approximate_end_time_hour}:${data?.approximate_end_time_min}`
        };
        console.log(getTime,"dispatch 0");
        if (getTime?.length > 0) {
            Axios.put(`normaluser/representation-working-hours/update/${getTime[0].id}/`, newData)
                .then(() => {
                    toast.success('ساعتی کاری شما با موفقیت ثبت شد');
                    setReload(!reload);
                    Axios.get('accounts/profile/').then(res => {
                        dispatch(infoHandler(res.data));
                        console.log(res.data, "dispatch 1");
                    });
                })
                .catch(() => {})
                .finally(() => {
                    setButtonLoader(false);
                });
        } else {
            Axios.post('normaluser/representation-working-hours/list_create/', newData)
                .then(() => {
                    toast.success('ساعتی کاری شما با موفقیت ثبت شد');
                    setReload(!reload);
                    Axios.get('accounts/profile/').then(res => {
                        dispatch(infoHandler(res.data));
                        console.log(res.data, "dispatch 2");
                    });
                })
                .catch(() => {})
                .finally(() => {
                    setButtonLoader(false);
                });
        }
    };

    useEffect(() => {
        Axios.get('normaluser/representation-working-hours/list_create/')
            .then(res => {
                console.log(res.data.results);
                setGetTime(res.data.results);
                if (res.data.results.length) {
                    const start_time = res.data.results[0].start_time.split(':');
                    const end_time = res.data.results[0].end_time.split(':');

                    setValue('approximate_start_time_hour', start_time[0]);
                    setValue('approximate_start_time_min', start_time[1]);
                    setValue('approximate_end_time_hour', end_time[0]);
                    setValue('approximate_end_time_min', end_time[1]);
                }
            })
            .catch(() => {});
    }, [reload]);

    return (
        <FormWrapper>
            <p className='title'>ساعت کار نمایندگی</p>
            <form onSubmit={handleSubmit(formSubmit)}>
                <TimePicker
                    title='زمان شروع کار نمایندگی'
                    hourDetail={{
                        ...register('approximate_start_time_hour', {
                            required: {
                                value: true,
                                message: 'این فیلد اجباری است'
                            }
                        })
                    }}
                    minDetail={{
                        ...register('approximate_start_time_min', {
                            required: {
                                value: true,
                                message: 'این فیلد اجباری است'
                            }
                        })
                    }}
                    error={(errors?.approximate_start_time_hour || errors?.approximate_start_time_min) && 'این فیلد اجباری است'}
                />
                <TimePicker
                    title='زمان پایان کار نمایندگی'
                    hourDetail={{
                        ...register('approximate_end_time_hour', {
                            required: {
                                value: true,
                                message: 'این فیلد اجباری است'
                            }
                        })
                    }}
                    minDetail={{
                        ...register('approximate_end_time_min', {
                            required: {
                                value: true,
                                message: 'این فیلد اجباری است'
                            }
                        })
                    }}
                    error={(errors?.approximate_end_time_hour || errors?.approximate_end_time_min) && 'این فیلد اجباری است'}
                />
                <FormButton
                    text={getTime?.length > 0 ? 'ویرایش' : 'ثبت'}
                    icon={brokenArrow}
                    type='submit'
                    backgroundColor='#174787'
                    color='white'
                    height={48}
                    loading={buttonLoader}
                    disabled={
                        getTime?.length > 0
                            ? !userPermissions.includes(PERMISSION.REPRESENTATION_WORKING_TIME.EDIT)
                            : !userPermissions.includes(PERMISSION.REPRESENTATION_WORKING_TIME.ADD)
                    }
                />
            </form>
        </FormWrapper>
    );
};

export default WorkTimeForm;
