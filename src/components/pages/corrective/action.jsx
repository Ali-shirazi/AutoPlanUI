/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

//Assets
import check from '../../../assets/images/icons/check.svg';
import add from '../../../assets/images/corrective/Add.svg';
import removeIcon from '../../../assets/images/global/TrashBin.svg'; // Add an icon for the remove button
import arrow from './../../../assets/images/global/arrow.svg';
import { ActionStyle } from './action.style';

//Components
import InputComponent from '../../form-groups/input-component';
import FormButton from '../../form-groups/form-button';

const Action = ({ setStep, setAllDetail, chosenEditItemDetails, allDetail }) => {
    const { register, handleSubmit, formState, control, setValue } = useForm({
        defaultValues: {
            actionFields: [{ action: '' }]
        },
        mode: 'onTouched'
    });

    const { errors } = formState;

    const { fields, append, remove } = useFieldArray({
        name: 'actionFields',
        control
    });

    useEffect(() => {
        if (allDetail?.actions) {
            setValue('actionFields', allDetail?.actions);
        } else {
            if (chosenEditItemDetails?.action) {
                const newArray = chosenEditItemDetails?.action?.map(item => ({ action: item.title }));
                setValue('actionFields', newArray);
            }
        }
    }, [chosenEditItemDetails]);

    const formSubmit = data => {
        setAllDetail(prev => ({
            ...prev,
            actions: data.actionFields
        }));
        setStep(4);
    };

    const handleAddInput = () => {
        append({ action: '' });
    };

    return (
        <ActionStyle>
            <form onSubmit={handleSubmit(formSubmit)}>
                <div className='input_group'>
                    {fields.map((field, index) => (
                        <div className='inputField' key={field.id}>
                            <InputComponent
                                title={`اقدام اصلاحی  ${index + 1}`}
                                icon={check}
                                type='text'
                                placeHolder='اقدام اصلاحی برای رفع عدم انطباق'
                                detail={{
                                    ...register(`actionFields.${index}.action`, {
                                        required: {
                                            value: true,
                                            message: 'این فیلد اجباری است'
                                        }
                                    })
                                }}
                                error={errors?.actionFields?.[index]?.action?.message}
                            />
                            {index + 1 === fields.length && (
                                <div className='add' onClick={handleAddInput}>
                                    <img src={add} alt='add' />
                                </div>
                            )}
                            {index > 0 && (
                                <div className='add' onClick={() => remove(index)}>
                                    <img src={removeIcon} alt='remove' />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <FormButton text='بعدی' type='submit' backgroundColor={'#174787'} color={'white'} height={48} icon={arrow} />
                <FormButton text='قبلی' backgroundColor='#174787' color='white' height={48} onClick={() => setStep(2)} margin={'20px 0'} />
            </form>
        </ActionStyle>
    );
};

export default Action;
