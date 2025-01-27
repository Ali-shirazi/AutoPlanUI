/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Axios from '../../../configs/axios';

//Assets
import Question from '../../../assets/images/corrective/Question.svg';
import { Style } from './style';

//Components
import FormButton from '../../form-groups/form-button';
import { toast } from 'react-hot-toast';

const EffectiveResult = ({ setStep, setAllDetail, setReload, chosenEditItemDetails, setIsModalOpen, allDetail }) => {
    const [buttonLoading, setButtonLoading] = useState(false);

    const { register, handleSubmit, formState, setValue } = useForm({
        defaultValues: {
            effectiveness_result: '',
            control_result: 'some'
        },
        mode: 'onTouched'
    });

    useEffect(() => {
        if (allDetail?.effectiveness_result) {
            //
            setValue('effectiveness_result', allDetail?.effectiveness_result);
        } else {
            if (chosenEditItemDetails?.effectiveness_result) {
                setValue('effectiveness_result', chosenEditItemDetails?.effectiveness_result);
            }
        }
    }, [chosenEditItemDetails]);

    const { errors } = formState;

    const formSubmit = data => {
        setButtonLoading(true);

        Axios.put(`/normaluser/corrective-action/retrieve_update_destroy/${chosenEditItemDetails?.id}/`, data)
            .then(() => {
                setReload(prev => !prev);
                setAllDetail(prev => ({
                    ...prev,
                    effectiveness_result: data.effectiveness_result
                }));
                setStep(1);

                setIsModalOpen(false);
                toast.success('با موفقیت ثبت گردید');
            })
            .catch(() => {})
            .finally(() => setButtonLoading(false));
    };

    return (
        <Style>
            <form onSubmit={handleSubmit(formSubmit)}>
                <div className={errors?.effectiveness_result ? 'text_area text_area_error' : 'text_area'}>
                    <p className='title'>نتیجه اثر بخشی</p>
                    <div>
                        <textarea
                            rows='5'
                            placeholder='نتیجه اثربخشی'
                            {...register('effectiveness_result', {
                                required: {
                                    value: true,
                                    message: 'این فیلد اجباری است'
                                }
                            })}
                        ></textarea>
                        <img src={Question} />
                    </div>
                    <p className='error'>{errors?.effectiveness_result?.message}</p>
                </div>
                <FormButton text='ثبت' loading={buttonLoading} type='submit' backgroundColor={'#174787'} color={'white'} height={48} />
                <FormButton text='قبلی' backgroundColor='#174787' color='white' height={48} onClick={() => setStep(7)} margin={'20px 0'} />
            </form>
        </Style>
    );
};

export default EffectiveResult;
