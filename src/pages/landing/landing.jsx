import React, { useEffect, useState } from 'react';
import { Grid, Fade, CardContent, Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// assets
import { LandingWrapper } from './landing.style';
import plumber from './../../assets/images/autoplan1.jpeg';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RhineLogo from "./../../assets/images/rhnelogowhite.png";

// components
import Navbar from '../../components/layouts/navbar';
import { useLocation } from 'react-router-dom';

const Landing = () => {
    const [landingfade, setLandingFade] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setLandingFade(true);
    }, []);

    useEffect(() => {
        if (location.hash) {
            const target = document.querySelector(location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.hash]);

    return (
        <LandingWrapper>
            <Navbar />
            <div className="container">
                <div className="introduce" id="introduce">
                    <Grid container spacing={2}>
                        <Grid item sx={{
                            height: "fit-content",
                        }} xs={12} >
                            <Fade in={landingfade} timeout={2000}>
                                <Card
                                    sx={{
                                        width: '100%',
                                        minHeight: '10rem',
                                        marginTop: '1rem',
                                        marginBottom: '1rem',
                                        boxShadow: '0.5rem 0.5rem 0.5rem #10315d',
                                        backgroundColor: 'transparent', 
                                        border: '2px solid #10315d',
                                        cursor: 'pointer',
                                        borderRadius: '1rem',
                                        position: 'relative', 
                                        overflow: 'hidden', 
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: 'white',
                                        
                                        '&::before': {
                                          content: '""',
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          bottom: 0,
                                          backgroundColor: '#283a49',
                                          filter: 'blur(100px)',
                                          backdropFilter: 'blur(10px)',
                                          zIndex: 1,
                                        },
                                        '& > *': {
                                          position: 'relative',
                                          zIndex: 2,
                                        },
                                      }}
                                >
                                    <Grid item xs={6}>
                                        <CardContent
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'start',
                                                alignItems: 'center',
                                                textAlign: 'center', 
                                                padding: '1rem',
                                                margin: "0",
                                            }}
                                        >
                                            <p style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: "#fff" }}>
                                                اتو پـــــلنـــــــــــــــ</p>
                                            <p style={{
                                                fontSize: '1.5rem', color: "#EDEEF7", display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'start',
                                                alignItems: 'start',
                                                textAlign: 'start', 
                                                padding: '0.8rem',
                                                gap: "1.5rem",
                                                width: "100%",
                                            }}><CheckBoxIcon sx={{ width: "3rem", height: "3rem", color: "whitesmoke" }} />راهکارهای کارآمد خدمات مرتبط با زمان سرویس خودرو
                                            </p>
                                            <p style={{
                                                fontSize: '1.5rem', color: "#EDEEF7", display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'start',
                                                alignItems: 'start',
                                                textAlign: 'center', 
                                                padding: '0.8rem',
                                                gap: "1.5rem",
                                                width: "100%"
                                            }}><CheckBoxIcon sx={{ width: "3rem", height: "3rem", color: "whitesmoke" }} />مدیریت بهینه تعمیر و نگهداری خودروها
                                            </p>
                                            <p style={{
                                                fontSize: '1.5rem', color: "#EDEEF7", display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'start',
                                                alignItems: 'start',
                                                textAlign: 'center', 
                                                padding: '0.8rem',
                                                gap: "1.5rem",
                                                width: "100%"
                                            }}><CheckBoxIcon sx={{ width: "3rem", height: "3rem", color: "whitesmoke" }} />بهینه‌سازی برنامه‌ریزی خدمات خودرو
                                            </p>
                                            <p style={{
                                                fontSize: '1.5rem', color: "#EDEEF7", display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'start',
                                                alignItems: 'start',
                                                textAlign: 'center', 
                                                padding: '0.8rem',
                                                gap: "1.5rem",
                                                width: "100%"
                                            }}><CheckBoxIcon sx={{ width: "3rem", height: "3rem", color: "whitesmoke" }} />مدیریت هوشمند زمان سرویس خودرو
                                            </p>
                                            <p style={{
                                                fontSize: '1.5rem', color: "#EDEEF7", display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'start',
                                                alignItems: 'start',
                                                textAlign: 'center', 
                                                padding: '0.8rem',
                                                gap: "1.5rem",
                                                width: "100%"
                                            }}><CheckBoxIcon sx={{ width: "3rem", height: "3rem", color: "whitesmoke" }} />اتوماسیون برنامه‌ریزی خدمات خودرو
                                            </p>
                                            <Grid item md={12} xs={12} width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                                                <img style={{ height: "8rem", width: "8rem" }} src={RhineLogo} alt="" />
                                                <Typography>𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐑𝐡𝐢𝐧𝐞</Typography>
                                                <Typography variant='subtitle1'>ᴠᴇʀꜱɪᴏɴ  1 .0</Typography>
                                            </Grid>
                                        </CardContent>

                                    </Grid>
                                    <Grid item xs={6} sx={{margin:"1rem"}}>
                                    <img className='imglanding' src={plumber} alt="plumber" />

                                    </Grid>

                                </Card>
                            </Fade>
                        </Grid>
                        {/* <Grid item sx={{
                            height: "100vh",
                        }} xs={12} md={6}>
                            <div className="img_wrapper">
                            </div>
                        </Grid> */}
                    </Grid>
                </div>
            </div>
        </LandingWrapper>
    );
};

export default Landing;
