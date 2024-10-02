import React, { useEffect, useState } from "react";
import Navbar from "../../components/layouts/navbar";
import { Slide, Typography, CardContent, Card, Container } from "@mui/material";
import plumberPhone from './../../assets/images/landing/plumber-making-phone-gesture.png';
import phoneCalling from './../../assets/images/landing/phoneCalling.svg';
import email from './../../assets/images/landing/email.svg';
import GrainIcon from '@mui/icons-material/Grain';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import BusinessIcon from '@mui/icons-material/Business';
import BroadcastOnPersonalIcon from '@mui/icons-material/BroadcastOnPersonal';
export default function ContactUs() {
  const [slide, setslide] = useState(false);
  useEffect(() => {
    setslide(true);
  }, [])
  return (
    <>
      <div className='pagecontainer'>
        <Navbar />
        <Slide direction="right" in={slide} timeout={1000} mountOnEnter unmountOnExit>

          <div className='container'>
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
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "start",
                padding: "2rem",
              }}>
                <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <img src={phoneCalling} alt="phonecall-icon" className="iconcontactus" />
                  <Typography className='title' sx={{ color: "whitesmoke" }}>تماس با ما</Typography>
                </Container>
                <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <GrainIcon sx={{ color: "whitesmoke", marginRight: "1rem" }} />
                    <Typography className='title' sx={{ color: "whitesmoke" }}>09121234123</Typography>
                  </Container>
                  <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <GrainIcon sx={{ color: "whitesmoke", marginRight: "1rem" }} />
                    <Typography className='title' sx={{ color: "whitesmoke" }}>09121234123</Typography>
                  </Container>
                  <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <GrainIcon sx={{ color: "whitesmoke", marginRight: "1rem" }} />
                    <Typography className='title' sx={{ color: "whitesmoke" }}>09121234123</Typography>
                  </Container>
                </Container>
                <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <img src={email} alt="phonecall-icon" className="iconcontactus" />
                  <Typography className='title' sx={{ color: "whitesmoke" }}>آدرس ایمیل</Typography>
                </Container>
                <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <AlternateEmailIcon sx={{ color: "whitesmoke", marginRight: "1rem" }} />
                    <Typography className='title' sx={{ color: "whitesmoke" }}>Rhine.Products@gmail.com</Typography>
                  </Container>
                </Container>
                <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <BusinessIcon sx={{ color: "black", backgroundColor: "whitesmoke", borderRadius: "100%", height: "2rem", width: "2rem", padding: "0.1rem" }} />
                  <Typography className='title' sx={{ color: "whitesmoke" }}>آدرس </Typography>
                </Container>
                <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <BroadcastOnPersonalIcon sx={{ color: "whitesmoke", marginRight: "1rem" }} />
                    <Typography className='title' sx={{ color: "whitesmoke" }}>خیابان انقلاب بعد از میدان فردوسی پلاک 745</Typography>
                  </Container>
                </Container>

              </CardContent>
            </Card>
          </div>
        </Slide>
      </div>
    </>
  )
}
