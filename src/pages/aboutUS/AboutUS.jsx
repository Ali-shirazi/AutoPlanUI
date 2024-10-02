import React, { useEffect, useState } from "react";
import Navbar from "../../components/layouts/navbar";
import { Slide, Typography, CardContent, Card, Container, Grid } from "@mui/material";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import plumberThumbUP from './../../assets/images/landing/plumber-with-thumb-up.png';
import RhineLogo from "./../../assets/images/rhnelogowhite.png";

export default function AboutUs() {
  const [slide, setslide] = useState(false);
  useEffect(() => {
    setslide(true);
  }, []);

  return (
    <>
      <div className='pagecontainer'>
        <Navbar />
        <Slide direction="left" in={slide} timeout={1000} mountOnEnter unmountOnExit>
          <Container maxWidth="lg" sx={{ marginY: "2rem" }}>

            <Grid item xs={12} md={7} >
              <Card sx={{
                width: '100%',
                minHeight: '10rem',
                marginTop: '1rem',
                marginBottom: '1rem',
                boxShadow: '0.5rem 0.5rem 0.5rem #10315d',
                backgroundColor: 'transparent', // Set to transparent to show the blur effect
                border: '2px solid #10315d',
                cursor: 'pointer',
                borderRadius: '1rem',
                position: 'relative', // Important for positioning the pseudo-element
                overflow: 'hidden', // Ensure the pseudo-element does not overflow
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

                // Ensure content is above the blur effect
                '& > *': {
                  position: 'relative',
                  zIndex: 2,
                },
              }}>
                <CardContent sx={{
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem"
                }}>
                  <Container maxWidth="sm" sx={{
                    display: "flex",
                    alignItems: "start",
                    gap: "1rem",
                    marginBottom: "2rem"
                  }}>
                    <SettingsSuggestIcon alt="aboutUs-icon" sx={{
                      width: "3rem",
                      height: "3rem",
                      backgroundColor: "whitesmoke",
                      borderRadius: "50%",
                      padding: "0.4rem",
                      color: "#10315d"
                    }} />
                    <Typography component="div" sx={{ color: "whitesmoke", textAlign: "justify" }}>
                      <div>
                        شرکت اتوپلن، پیشرو در ارائه خدمات برنامه‌ریزی و تعمیرات خودرو، با هدف ارائه بهترین خدمات به مشتریان تأسیس شده است. تیم مجرب و متخصص ما با استفاده از فناوری‌های نوین و ابزارهای پیشرفته، به ارائه خدمات تعمیر و نگهداری انواع خودروها می‌پردازد. ما معتقدیم که رضایت مشتریان کلید موفقیت ماست، از این رو تمامی تلاش خود را به کار می‌بندیم تا با ارائه خدماتی سریع، کارآمد و با کیفیت، تجربه‌ای بی‌نظیر را برای شما فراهم آوریم. در اتوپلان، سلامت و عملکرد بهینه خودرو شما اولویت ماست و همواره در تلاشیم تا با بهره‌گیری از جدیدترین روش‌ها و استانداردها، خدماتی درخور اعتماد و رضایت شما ارائه دهیم.
                      </div>
                      <Grid item md={12} xs={12} width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                        <img style={{ height: "8rem", width: "8rem" }} src={RhineLogo} alt="" />
                        <Typography component="h6">𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐑𝐡𝐢𝐧𝐞</Typography>
                        <Typography variant='subtitle1' component="p">ᴠᴇʀꜱɪᴏɴ 1.0</Typography>
                      </Grid>
                    </Typography>

                  </Container>
                </CardContent>
              </Card>
            </Grid>

          </Container>
        </Slide>
      </div>
    </>
  )
}
