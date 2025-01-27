import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Axios from './../../../configs/axios';

//Assets
import Question from '../../../assets/images/corrective/Question.svg';
import add from '../../../assets/images/corrective/Add.svg';
import arrow from './../../../assets/images/global/arrow.svg';
import Minusicon from './../../../assets/images/icons/Minus.svg';
import { RootingStyle } from './rootting.style';

//Components
import FormButton from '../../form-groups/form-button';

const Rootting = ({ setStep, setAllDetail, chosenEditItemDetails, allDetail }) => {
    const [inputValues, setInputValues] = useState([[''], [''], [''], [''], ['']]);

    useEffect(() => {
        if (allDetail?.troubleshooting) {
            setInputValues(allDetail?.troubleshooting);
        } else {
            if (chosenEditItemDetails?.whys) {
                const newArray = [[], [], [], [], []];

                chosenEditItemDetails?.whys?.forEach(item => {
                    if (item.type === 'why1') {
                        newArray[0].push(item.title);
                    } else if (item.type === 'why2') {
                        newArray[1].push(item.title);
                    } else if (item.type === 'why3') {
                        newArray[2].push(item.title);
                    } else if (item.type === 'why4') {
                        newArray[3].push(item.title);
                    } else if (item.type === 'why5') {
                        newArray[4].push(item.title);
                    }
                });
                setInputValues(newArray);
                console.log(inputValues, "inputValues");

            }
        }
    }, [chosenEditItemDetails]);

    const inputValuehandler = (e, index, valueIndex) => {
        const updatedValues = [...inputValues];
        updatedValues[index][valueIndex] = e.target.value;
        setInputValues(updatedValues);
        console.log(inputValues, "inputValueshandler");
    };

    const addInputhandler = index => {
        const updatedValues = [...inputValues];
        updatedValues[index].push('');
        setInputValues(updatedValues);
        console.log(inputValues, "inputValuesadd");
    };

    const removeInputhandler = index => {
        const updatedValues = [...inputValues];
        if (updatedValues[index].length > 1) {
            updatedValues[index].pop();
            setInputValues(updatedValues);
            console.log(inputValues, "inputValuesdelet");
        }
    };

    const sendDataHandler = () => {
        const allTruthy = inputValues.every(innerArr => innerArr.every(item => Boolean(item.trim())));

        if (allTruthy) {
            setStep(3);
            setAllDetail(prev => ({
                ...prev,
                troubleshooting: inputValues
            }));
        } else {
            toast.error('لطفا تمام مقادیر را پر کنید', {
                position: 'top-left'
            });
        }
    };

    return (
        <RootingStyle>
            <h3>ریشه یابی</h3>
            {inputValues.map((item, index) => (
                <div className='input_group' key={`rooting_add_item_${index}`}>
                    {item.map((val, valueIndex) => (
                        <div className='inputField' key={`rooting_inputs_add_item_${valueIndex}`}>
                            <input
                                type='text'
                                placeholder={`چرا-${index + 1}`}
                                onChange={e => inputValuehandler(e, index, valueIndex)}
                                value={val}
                            />
                            <img src={Question} alt='' />
                        </div>
                    ))}
                    <div className='action_button'>
                        <img src={add} alt='add' onClick={() => addInputhandler(index)} />
                        <img src={Minusicon} alt='remove' onClick={() => removeInputhandler(index)} />
                    </div>
                </div>
            ))}
            <FormButton text='بعدی' backgroundColor='#174787' color='white' height={48} icon={arrow} onClick={sendDataHandler} />
            <FormButton text='قبلی' backgroundColor='#174787' color='white' height={48} onClick={() => setStep(1)} margin={'20px 0'} />
        </RootingStyle>
    );
};

export default Rootting;
