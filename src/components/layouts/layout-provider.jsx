/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeSideBar } from '../../store/reducers/sideBar';
import { useEffect } from 'react';
import Axios from '../../configs/axios';
import { infoHandler } from '../../store/reducers/user';

//assets
import { LayoutProviderStyle } from './layout-provider.style';
import bg from '../../assets/images/global/bg.svg';

//components
import Navbar from './navbar';
import SideBar from './sidebar';

const LayoutProvider = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();
    const isLaptop = useMediaQuery(theme.breakpoints.up('lg'));
    const sideBarStatus = useSelector(state => state.sideBar);

    useEffect(() => {
        if (localStorage.getItem('AutoPlaningToken') !== null) {
            Axios.get('accounts/profile/').then(res => {
                dispatch(infoHandler(res.data));
            });
        } else {
            navigate('/');
        }
    }, []);

    return (
        <>
            <Navbar />
            <LayoutProviderStyle bg={bg}>
                {isLaptop && <SideBar />}
                <div className='content'>
                    <Outlet />
                </div>
                <Drawer anchor='right' open={sideBarStatus} onClose={() => dispatch(closeSideBar())}>
                    <SideBar />
                </Drawer>
            </LayoutProviderStyle>
        </>
    );
};

export default LayoutProvider;
