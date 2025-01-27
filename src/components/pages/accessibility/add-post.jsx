import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Axios from '../../../configs/axios';
import { toast } from 'react-hot-toast';

//Assets
import { AddModalWrapper } from './add-modal.style';
import UserHandUp from './../../../assets/images/icons/UserHandUp.svg';
import Medal from './../../../assets/images/icons/Medal.svg';

//Components
import InputComponent from '../../form-groups/input-component';
import FormButton from '../../form-groups/form-button';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

const AddPost = ({ setReload, setState, editModalData, modalStatus, subModalCloseHandler }) => {
    const [permissionList, setPermissionList] = useState([{ value: '', label: '', id: '' }]);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, formState, control, reset, setValue } = useForm({
        defaultValues: {
            title: '',
            technical_force: false
        },
        mode: 'onTouched'
    });

    const { errors } = formState;

    useEffect(() => {
        setLoading(true);
        Axios.get('accounts/permissions/?page_size=500')
            .then(res => {
                // console.log(res, "sssssssssssss");
                let permission = res.data.results.map(item => ({
                    label: item?.title,
                    value: item?.code
                }));
                setPermissionList(permission);
                if (modalStatus === 'edit') {
                    setValue('title', editModalData?.title);
                    setValue('technical_force', editModalData?.technical_force);
                    const selectedPermissions = editModalData?.permissions_info.map(item => ({
                        label: item?.title,
                        value: item?.code
                    }));
                    setValue('permissions', selectedPermissions);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [editModalData]);

    const formSubmit = data => {
        const newArray = data.permissions.map(item => item.value);
        const newData = {
            technical_force: data.technical_force,
            title: data.title,
            permissions: newArray
        };

        setButtonLoader(true);
        if (modalStatus === 'edit') {
            Axios.put(`/normaluser/organizational-position/retrieve_update_destroy/${editModalData?.id}/`, newData)
                .then(() => {
                    setButtonLoader({ ...buttonLoader, modalButton: false });
                    setReload(prev => !prev);
                    toast.success('پست سازمانی با موفقیت ویرایش شد');
                    setState(false);
                    reset();
                })
                .catch(() => {})
                .finally(() => setButtonLoader(false));
        } else {
            Axios.post('/normaluser/organizational-position/list_create/', newData)
                .then(() => {
                    setReload(prev => !prev);
                    setState(false);
                    toast.success('پست جدید با موفقیت ثبت شد');
                    reset();
                    subModalCloseHandler();
                })
                .catch(() => {})
                .finally(() => setButtonLoader(false));
        }
    };

    return (
        <AddModalWrapper error={errors?.permissions?.message}>
            <h3>{modalStatus === 'edit' ? 'ویرایش پست سازمانی' : 'اضافه کردن پست سازمانی جدید'}</h3>

            {loading ? (
                <div className='loading'>
                    <CircularProgress />
                </div>
            ) : (
                <form onSubmit={handleSubmit(formSubmit)}>
                    <InputComponent
                        title='نام پست سازمانی جدید'
                        placeHolder='نام پست'
                        icon={Medal}
                        type='text'
                        detail={{
                            ...register('title', {
                                required: {
                                    value: true,
                                    message: 'این فیلد اجباری است'
                                }
                            })
                        }}
                        error={errors?.title}
                    />
                    <div className='auto_complete_wrapper'>
                        <p className='auto_complete_title'>دسترسی</p>
                        <div className='auto_complete'>
                            <Controller
                                control={control}
                                name='permissions'
                                rules={{ required: 'این فیلد اجباری است' }}
                                render={({ field: { onChange, value } }) => {
                                    const filteredOptions = permissionList.filter(
                                        option => !value?.some(selected => selected.value === option.value)
                                    );
                                    return (
                                        <Autocomplete
                                            multiple
                                            options={filteredOptions}
                                            value={value}
                                            filterSelectedOptions
                                            getOptionLabel={option => option?.label}
                                            onChange={(_, newValue) => {
                                                onChange(newValue.filter(value => value));
                                            }}
                                            sx={{ width: '100%' }}
                                            renderInput={params => <TextField {...params} />}
                                        />
                                    );
                                }}
                            />
                            <img src={UserHandUp} />
                        </div>
                        <p className='auto_complete_error'>{errors?.permissions?.message}</p>
                    </div>

                    <div className='checkbox_wrapper'>
                        <p>نیروی فنی</p>
                        <input type='checkbox' {...register('technical_force')} />
                    </div>
                    <FormButton
                        text={modalStatus === 'edit' ? 'ویرایش' : 'ثبت'}
                        type='submit'
                        backgroundColor='#174787'
                        color='white'
                        height={48}
                        loading={buttonLoader}
                    />
                </form>
            )}
        </AddModalWrapper>
    );
};

export default AddPost;
