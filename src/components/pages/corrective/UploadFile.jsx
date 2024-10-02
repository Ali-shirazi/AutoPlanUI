/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

//style
import { UploadFileStyle } from './UploadFile.style';

//mui
import IconButton from '@mui/material/IconButton';

const UploadFile = ({ title, setFile }) => {
    const [buttonLoader, setButtonLoader] = useState(false);
    const [fileName, setFileName] = useState('');

    const { register, handleSubmit, formState, reset } = useForm({
        defaultValues: {
            file: ''
        },
        mode: 'onTouched'
    });
    const { errors } = formState;

    const formSubmit = data => {
        setButtonLoader(true);
        const formData = new FormData();
        formData.append('file', data.file[0]);
    };

    return (
        <UploadFileStyle onSubmit={handleSubmit(formSubmit)} error={errors?.file?.message}>
            <IconButton color='primary' component='label' className='upload'>
                <input
                    hidden
                    type='file'
                    {...register('file', {
                        onChange: filedValue => {setFileName(filedValue?.target?.files?.[0]?.name); setFile(filedValue?.target?.files?.[0])}
                    })}
                />
                <div className='content'>
                    <div>
                        <h3>مستندات مربوطه</h3>
                        <p>
                            {!fileName
                                ? ` می توانید مستندات خود را در این بخش بارگزاری کنید `
                                : fileName}
                        </p>
                    </div>
                </div>
            </IconButton>
            <p className='error_message'>{errors?.file?.message}</p>
        </UploadFileStyle>
    );
};

export default UploadFile;
