/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { getDesignTokens } from '../configs/theme';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { loginStatusHandler } from '../store/reducers/user';
import OtherErrors from './OtherErrors.jsx';
// Assets
import '../assets/styles/general.css';

// MUI
import { ThemeProvider, createTheme, useMediaQuery, useTheme } from '@mui/material';

// Tools
import PERMISSION from '../utils/permission.ts';

//components
import LayoutProvider from './layouts/layout-provider';
import Qualification from '../pages/qualification/qualification';
import Deficiency from '../pages/deficiency/deficiency';
import Planning from '../pages/planning/planning';
import Deviation from '../pages/deviation/deviation';
import Corrective from '../pages/corrective/corrective';
import Accessibility from '../pages/accessibility/accessibility';
import Reporting from '../pages/reporting/reporting';
import Dashboard from '../pages/dashboard/dashboard';
import Setting from '../pages/setting/setting';
import Landing from '../pages/landing/landing';
import store from '../store/store';
import Modal from './template/modal';
import MobileAlertModal from './template/mobile-alert-modal';
import Station from '../pages/station/station';
import AddAdmin from '../pages/add-admin/add-admin';
import Equipment from '../pages/equipment/equipment';
import Equip from '../pages/equip-management/equip';
import Manufacture from '../pages/manufacture/manufacture';
import Car from '../pages/cars/cars';
import Part from '../pages/parts/parts';
import NotFound from './NotFound .jsx';
import AboutUs from '../pages/aboutUS/AboutUS.jsx';
import ServicesPage from '../pages/servicespage/ServicesPage.jsx';
import ContactUs from '../pages/contactUS/ContactUs.jsx';
import UsersManagement from '../pages/UsersManagement.js'
 
const AuthenticationGuard = ({ children }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.User);

    if (localStorage.getItem('AutoPlaningToken') !== null) {
        dispatch(loginStatusHandler(true));
    }

    if (userInfo.isLoggedIn) {
        if ((location.pathname !== '/addAdmin' && location.pathname !== '/equip-management' && location.pathname !== '/manufactures' && location.pathname !== '/parts' && location.pathname !== '/cars') && userInfo.info.role === 'SuperAdmin') {
            return <Navigate to='/addAdmin' replace state={{ path: location.pathname }} />;
        }

        if (userInfo.info.role === 'Worker') {
            const userPermissions = JSON.parse(localStorage.getItem('AutoPlanUserInfo')).permissions;
            const matchingObjects = [];

            for (const key in PERMISSION) {
                if (typeof PERMISSION[key] === 'object') {
                    for (const subKey in PERMISSION[key]) {
                        if (typeof PERMISSION[key][subKey] === 'number' && userPermissions.includes(PERMISSION[key][subKey])) {
                            matchingObjects.push(PERMISSION[key].URL);
                            break;
                        }
                    }
                }
            }

            if (!matchingObjects.includes(location.pathname)) {
                return <Navigate to={matchingObjects[0]} replace state={{ path: location.pathname }} />;
            }
        }
    }
    return <LayoutProvider>{children}</LayoutProvider>;
};

function App() {
    const themeConfig = createTheme(getDesignTokens('light'));
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(450));

    return (
        <Provider store={store}>
            <Toaster
                position='bottom-left'
                containerStyle={{
                    zIndex: 9999,
                    fontWeight: '400',
                    fontSize: '0.93rem'
                }}
            />
            <ThemeProvider theme={themeConfig}>
                <Routes>
                    <Route path='/' errorElement={<OtherErrors />} element={<Landing />} />
                    <Route path='/' element={<AuthenticationGuard />}>
                        <Route errorElement={<OtherErrors />} path='dashboard' element={<Dashboard />} />
                        <Route errorElement={<OtherErrors />} path='equip-management' element={<Equip />} />
                        <Route errorElement={<OtherErrors />} path='cars' element={<Car />} />
                        <Route errorElement={<OtherErrors />} path='parts' element={<Part />} />
                        <Route errorElement={<OtherErrors />} path='manufactures' element={<Manufacture />} />
                        <Route errorElement={<OtherErrors />} path='qualification' element={<Qualification />} />
                        <Route errorElement={<OtherErrors />} path='station' element={<Station />} />
                        <Route errorElement={<OtherErrors />} path='deficiency' element={<Deficiency />} />
                        <Route errorElement={<OtherErrors />} path='planning' element={<Planning />} />
                        <Route errorElement={<OtherErrors />} path='deviation' element={<Deviation />} />
                        <Route errorElement={<OtherErrors />} path='equipment' element={<Equipment />} />
                        <Route errorElement={<OtherErrors />} path='corrective' element={<Corrective />} />
                        <Route errorElement={<OtherErrors />} path='accessibility' element={<Accessibility />} />
                        <Route errorElement={<OtherErrors />} path='reporting' element={<Reporting />} />
                        <Route errorElement={<OtherErrors />} path='setting' element={<Setting />} />
                        <Route errorElement={<OtherErrors />} path='addAdmin' element={<AddAdmin />} />
                        <Route errorElement={<OtherErrors />} path='user-management' element={<UsersManagement />} />
                    </Route>
                    <Route errorElement={<OtherErrors />} path="/About-us" element={<AboutUs />} />
                    <Route errorElement={<OtherErrors />} path="/Services" element={<ServicesPage />} />
                    <Route errorElement={<OtherErrors />} path="/Contact-us" element={<ContactUs />} />
                    <Route errorElement={<OtherErrors />} path='*' element={<NotFound />} />
                </Routes>
            </ThemeProvider>

            <Modal state={isMobile} fullScreen={true}>
                <MobileAlertModal />
            </Modal>
        </Provider>
    );
}

export default App;
// Admin
// Worker
// SuperAdmin
