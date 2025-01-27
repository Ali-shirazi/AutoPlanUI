import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { openSideBar } from '../../store/reducers/sideBar';

//Assets
import logo from '../../assets/images/header/logo.svg';
import loginIcon from '../../assets/images/header/loginIcon.svg';
import hamburgerMenu from './../../assets/images/header/hamburgerMenu.svg';
import menuIcon from './../../assets/images/sideBar/menuIcon.svg';
import { NavbarStyle } from './navbar.style';

//Components
import Login from '../../pages/login/login';
import FormButton from '../../components/form-groups/form-button';
import MobileNavbar from './mobile-navbar';

const Navbar = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.User.isLoggedIn);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showNavbarMenuModal, setShowNavbarMenuModal] = useState(false);
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const showSideBarIcon = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    return (
        <>
            <NavbarStyle>
                {isTablet ? (
                    <>
                        <div className='rightItems'>
                            <FormButton icon={menuIcon} onClick={() => dispatch(openSideBar())} />
                            <Link to='/dashboard' className='logoHeader'>
                                <img src={logo} alt='logo' className='logoStyle' />
                                <h2>اتو پـــــلنـــــــــــــــ</h2>
                            </Link>
                        </div>
                        <FormButton icon={hamburgerMenu} width={'fit-content'} onClick={() => setShowNavbarMenuModal(true)} />
                    </>
                ) : (
                    <>
                        <div className='rightItems'>
                            {showSideBarIcon && <FormButton icon={menuIcon} onClick={() => dispatch(openSideBar())} />}

                            <Link to='/' className='logoHeader'>
                                <img src={logo} alt='logo' className='logoStyle' />
                                <h2>اتو پـــــلنـــــــــــــــ</h2>
                            </Link>
                        </div>
                        <ul className='menuList'>
                            <li>
                                <NavLink to='/'>صفحه اصلی</NavLink>
                            </li>
                            <li>
                                <NavLink to='/Services'>خدمات</NavLink>
                            </li>
                            <li>
                                <NavLink to='/About-us'>درباره ما</NavLink>
                            </li>
                            <li>
                                <NavLink to='/Contact-us'>تماس با ما</NavLink>
                            </li>
                        </ul>
                        {!userInfo ? (
                            <FormButton
                                text='ورود به سیستم'
                                icon={loginIcon}
                                loading={false}
                                width={'fit-content'}
                                className='login'
                                onClick={() => setShowLoginModal(true)}
                            />
                        ) : (
                            <Link to='/dashboard' className='dashboard_btn'>
                                داشبورد
                            </Link>
                        )}
                    </>
                )}
            </NavbarStyle>
            <Login showModal={showLoginModal} setShowModal={setShowLoginModal} />
            <Drawer anchor='left' open={showNavbarMenuModal} onClose={() => setShowNavbarMenuModal(false)}>
                <MobileNavbar setShowNavbarMenuModal={setShowNavbarMenuModal} setShowLoginModal={setShowLoginModal} />
            </Drawer>
        </>
    );
};

export default Navbar;
