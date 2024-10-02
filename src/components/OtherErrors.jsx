import React, { useEffect, useState } from "react";
import Navbar from "./layouts/navbar";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";

import notfoundlogo from "../assets/images/error-404-wordpress.jpg";
export default function OtherErrors() {
  const [fade, setfade] = useState(false);
  useEffect(() => {
    setfade(true);
  }, [])
  const navigate = useNavigate();
  return (
    <>
      <div className='pagecontainer'>
        <Navbar />
        <Fade in={fade} unmountOnExit timeout={3000}>
          <Container maxWidth="lg" sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            minHeight: "70vh",
            gap: "1rem",
          }}>
            <Typography sx={{
              fontSize: "1.5rem",
              marginTop: "3rem",
              color: "whitesmoke",
            }}>متاسفیم، مشکلی پیش آمده است !</Typography>
            {/* <img src={notfoundlogo} alt="404-notfound" className="imgNotfound" /> */}
            <Button onClick={() => { navigate("/") }} variant="contained" sx={{
              gap: "1rem",
            }} startIcon={<SendIcon />}>
              بازگشت به صفحه اصلی
            </Button>
          </Container>
        </Fade>

      </div>
    </>
  )
}
