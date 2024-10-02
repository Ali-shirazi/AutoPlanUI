import React, { useEffect, useState } from "react";
import Navbar from "../../components/layouts/navbar";
import { Slide, Typography, CardContent, Card, CardMedia, Container, Box, Grid } from "@mui/material";
import serviceImage from "../../assets/images/landing/background-plumber.png";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function ContactUs() {
  const [slide, setslide] = useState(false);
  useEffect(() => {
    setslide(true);
  }, []);

  return (
    <>
      <div className="pagecontainer">
        <Navbar />
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem 0' }}>
          <Slide direction="down" in={slide} timeout={1000} mountOnEnter unmountOnExit>
            <Card sx={{ width: "100%", maxWidth: "1200px", boxShadow: "1rem 1rem 1rem black", borderRadius: "2rem", overflow: 'hidden', position: 'relative' }}>
              <CardMedia
                component="img"
                image={serviceImage}
                alt="Background Image"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
              <CardContent sx={{
                position: "relative",
                zIndex: 2,
                backgroundColor: "rgba(20, 61, 116, 0.8)", // Semi-transparent background
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "whitesmoke",
                padding: "2rem",
              }}>
                <Container maxWidth="lg" sx={{ textAlign: "center" }}>
                  <Box sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "1rem", borderRadius: "1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item xs={12} md={6}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <SettingsSuggestIcon sx={{ width: "3rem", height: "3rem", backgroundColor: "whitesmoke", borderRadius: "50%", padding: "0.4rem", color: "#10315d", mb: 2 }} />
                          <Typography sx={{ fontSize: "1.2rem", lineHeight: "1.8rem", textAlign: "justify", margin: "1rem" }}>
                            شرکت اتوپلان با ارائه خدمات برنامه‌ریزی تعمیرات خودرو، گامی مؤثر در افزایش کارایی و کاهش هزینه‌های نگهداری خودروها برداشته است. با استفاده از سیستم‌های پیشرفته و نرم‌افزارهای تخصصی، ما قادر به ایجاد برنامه‌های تعمیر و نگهداری منظم برای هر نوع خودرو هستیم. این برنامه‌ها شامل زمان‌بندی دقیق برای انجام تعمیرات دوره‌ای، بررسی و تعویض قطعات مصرفی و همچنین پیش‌بینی نیازهای آینده خودرو بر اساس الگوهای مصرف و کارکرد آن است. هدف ما از این خدمات، افزایش طول عمر خودروها، کاهش خطر خرابی‌های ناگهانی و به حداقل رساندن هزینه‌های اضافی است.
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <AccessTimeIcon sx={{ width: "3rem", height: "3rem", backgroundColor: "whitesmoke", borderRadius: "50%", padding: "0.4rem", color: "#10315d", mb: 2 }} />
                          <Typography sx={{ fontSize: "1.2rem", lineHeight: "1.8rem", textAlign: "justify", margin: "1rem" }}>
                            یکی دیگر از خدمات برجسته ما، محاسبه انحراف معیار و زمان‌سنجی دقیق تعمیرات است. با تحلیل داده‌های جمع‌آوری شده از تعمیرات گذشته، ما می‌توانیم انحراف معیار زمان انجام هر نوع تعمیر را محاسبه کرده و بر اساس آن، پیش‌بینی دقیقی از زمان لازم برای تعمیرات آینده ارائه دهیم. این تحلیل‌ها به ما این امکان را می‌دهد که فرآیند تعمیرات را بهینه‌سازی کرده و زمان انتظار مشتریان را به حداقل برسانیم. علاوه بر این، با استفاده از تکنیک‌های زمان‌سنجی، ما می‌توانیم کارایی کارکنان خود را ارتقاء داده و کیفیت خدمات ارائه شده را بهبود بخشیم. در اتوپلان، ما همواره در جستجوی روش‌های نوین برای بهبود و ارتقاء خدمات خود هستیم تا اطمینان حاصل کنیم که خودروهای شما در بهترین وضعیت ممکن قرار دارند.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Container>
              </CardContent>
            </Card>
          </Slide>
        </Container>
      </div>
    </>
  );
}
