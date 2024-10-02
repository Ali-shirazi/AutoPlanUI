import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import VerificationInput from 'react-verification-input';
import Axios from '../../configs/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { infoHandler, loginStatusHandler } from '../../store/reducers/user';

//assets
import { LoginStyle } from './login.style';
import shape1 from './../../assets/images/login/shape1.png';
import shape2 from './../../assets/images/login/shape2.png';
import addPhone from './../../assets/images/login/addPhone.svg';

//components
import Modal from '../../components/template/modal';
import InputComponent from '../../components/form-groups/input-component';
import FormButton from '../../components/form-groups/form-button';
import { Box } from '@mui/material';

const Login = ({ showModal, setShowModal }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginStatus, setLoginStatus] = useState('addPhoneNumber');
    const [codeValue, setCodeValue] = useState();
    const [loader, setLoader] = useState({
        login: false,
        otp: false
    });

    const [time, setTime] = useState(120);
    const [timestatus, setTimestatus] = useState("");
    const timerRef = useRef(null); // Ref to hold the interval ID
    const [mobileNo, setMobileNo] = useState()

    const [inputValues, setInputValues] = useState({
        mobile_number: '',
        code: ''
    });

    const form = useForm({
        defaultValues: {
            mobile_number: ''
        },
        mode: 'onTouched'
    });

    const { register, formState, handleSubmit, reset } = form;
    const { errors } = formState;

    const sendCodeHandler = data => {
        setInputValues({
            ...inputValues,
            mobile_number: data.mobile_number
        });
    
        setLoader({
            ...loader,
            otp: true
        });
    
        Axios.post('accounts/send-otp/', data)
            .then(() => {
                setLoginStatus('sendConfirmCode');
                localStorage.setItem("mobileNo", data.mobile_number);
                setMobileNo(data.mobile_number);
                setCodeValue('');  // Reset the verification code input
            })
            .catch(() => { })
            .finally(() => {
                setLoader({
                    ...loader,
                    otp: false
                });
            });
    };
    

    const closeModalHandler = () => {
        reset();  // Reset form fields
        setLoginStatus('addPhoneNumber');  // Set the login status back to the first step
        setCodeValue('');  // Clear the verification code input
        setShowModal(false);  // Close the modal
        setTimestatus('');  // Reset the timer status
        setTime(120);  // Reset the timer value
        if (timerRef.current) {
            clearInterval(timerRef.current);  // Clear any running timer intervals
        }
    };
    
    useEffect(() => {
        setTime(120);

    }, [mobileNo])

    const loginHandler = data => {
        setLoader({
            ...loader,
            login: true
        });
        Axios.post('accounts/login/', {
            mobile_number: inputValues.mobile_number,
            code: data
        })
            .then(res => {
                localStorage.setItem(
                    'AutoPlaningToken',
                    JSON.stringify({
                        token: res.data.token
                    })
                );
                Axios.get('accounts/profile/').then(res => {
                    dispatch(infoHandler(res.data));
                    dispatch(loginStatusHandler(true));
                    localStorage.setItem(
                        'AutoPlanUserInfo',
                        JSON.stringify({
                            role: res.data.role,
                            permissions: res.data.permission
                        })
                    );
                    toast.success('ورود شما با موفقیت انجام شد');
                    navigate('/dashboard');
                });
            })
            .catch(() => { })
            .finally(() => {
                setLoader({
                    ...loader,
                    login: false
                });
            });
    };

    useEffect(() => {
        if (timestatus === "on") {
            timerRef.current = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime === 0) {
                        clearInterval(timerRef.current);
                        setTimestatus("");
                        closeModalHandler();
                        localStorage.setItem("timer", 120);
                        return 0;
                    } else {
                        localStorage.setItem("timer", prevTime);
                        return prevTime - 1;
                    }
                });
            }, 1000);
        }
    
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timestatus]);
    

    return (
        <Modal state={showModal} setState={setShowModal} handleClose={closeModalHandler}>
            <LoginStyle>
                <img src={shape1} alt='' className='shapeTop' />
                <img src={shape2} alt='' className='shapeTop' />
                <img src={shape1} alt='' className='shapeBottom' />
                <img src={shape2} alt='' className='shapeBottom' />
                <form onSubmit={handleSubmit(sendCodeHandler)}>
                    <h2 className='title'>ورود به سیستم</h2>
                    {loginStatus === 'addPhoneNumber' ? (
                        <div className='firstStep'>
                            <p className='text'>
                                کاربر گرامی، خواهشمندیم جهت ورود به حساب کاربری و استفاده از خدمات اتو پلنینگ ، شماره تلفن همراه خود را در
                                کادر زیر وارد نمایید.
                            </p>
                            <InputComponent
                                title='شماره موبایل'
                                type='tel'
                                icon={addPhone}
                                className='InputComponent'
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
                                error={errors?.mobile_number}
                                placeHolder='---------۰۹'
                            />
                            <FormButton
                                text='ادامه'
                                loading={loader.otp}
                                type='buttom'
                                backgroundColor='#174787'
                                color='white'
                                height={48}
                                margin='30px 0 0 0'
                                onClick={() => { setTimestatus("on") }}
                            />
                        </div>
                    ) : loginStatus === 'sendConfirmCode' ? (
                        <div className='secondStep'>
                            <p className='text'>
                                کد یکبار مصرف به شماره {inputValues.mobile_number} پیامک شد؛ لطفا کد ارسال شده را در کادر زیر وارد نمایید.
                            </p>
                            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "1rem" }}>
                                <p className='verificationText'>کد یکبار مصرف</p>
                                <p>{`(  ${Math.floor(time / 60)}`.padStart(2, 0)}:
                                    {`${time % 60}  )`.padStart(2, 0)}</p>
                            </Box>
                            <div className='codeInput'>
                                <VerificationInput
                                    key={loginStatus}  // Add key to force re-render on step change
                                    value={codeValue}
                                    length={4}
                                    autoFocus={true}
                                    validChars='0-9'
                                    placeholder='-'
                                    onChange={(val) => setCodeValue(val)}
                                    onComplete={e => loginHandler(e)}
                                    classNames={{
                                        container: 'container',
                                        character: 'character'
                                    }}
                                />

                            </div>
                            <FormButton
                                text='ثبت'
                                loading={loader.login}
                                backgroundColor={'#174787'}
                                color={'white'}
                                height={48}
                                margin='30px 0 0 0'
                            />
                        </div>
                    ) : null}
                </form>
            </LoginStyle>
        </Modal>
    );
};

export default Login;
