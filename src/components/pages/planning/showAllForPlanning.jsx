import React, { useRef } from 'react';
import { Grid, Divider } from '@mui/material';

// Assets
import { ShowAllStyle } from '../corrective/show-all.style';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

const ShowAllForPlanning = ({ DetailsModal, selectedID }) => {
    const printRef = useRef();


    const currentDetail = DetailsModal.filter((item) => {
        return item.id === selectedID;
    })

    // currentDetail[0]?.time_to_troubleshoot_info?.map(item => { console.log(item, "DetailsModal1") })
    // console.log(currentDetail[0], selectedID, "pppppppppp");
    function handlePrint() {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    }
    return (
        <ShowAllStyle>
            <div ref={printRef}>
                <h2>مشاهده برنامه ریزی تعمیرات</h2>
                <LocalPrintshopIcon onClick={handlePrint} sx={{ width: "3rem", height: "3rem", cursor: "pointer" }} />
                <p>چاپ گزارش</p>
                <Grid container sx={{ marginTop: '50px', minHeight: "500px" }} spacing={2}>
                    <Grid item xs={12} md={4}>
                        <div className='container'>
                            <div className='item'>
                                <p className='title'>نام آوردنده</p>
                                <p className='text'>
                                    <span>{currentDetail[0]?.customer_name}</span>
                                </p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className='container'>
                            <div className='item'>
                                <p className='title'>شماره موبایل</p>
                                <p className='text'>
                                    <span>{currentDetail[0]?.customer_mobile_number}</span>
                                </p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className='container'>
                            <div className='item'>
                                <p className='title'>گروه خودرویی</p>
                                <p className='text'>
                                    <span>{currentDetail[0]?.car_brand}</span>
                                </p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className='container'>
                            <div className='item'>
                                <p className='title'>مدل</p>
                                <p className='text'>
                                    <span>{currentDetail[0]?.car_model}</span>
                                </p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className='container'>
                            <div className='item'>
                                <p className='title'>نوع خودرو</p>
                                <p className='text'>
                                    <span>{currentDetail[0]?.car_type}</span>
                                </p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className='container'>
                            <div className='item'>
                                <p className='title'>شماره پلاک</p>
                                <p className='text'>
                                    <span>{currentDetail[0]?.plaque_1}-{currentDetail[0]?.plaque_2}-{currentDetail[0]?.plaque_3}-ایران{currentDetail[0]?.plaque_4}</span>
                                </p>
                            </div>
                        </div>
                    </Grid>

                    <Divider variant="inset" component="span" sx={{ width: "100%", marginY: "3rem" }} />

                    <Grid item xs={12}>
                        <div className='container'>
                            {currentDetail[0]?.diagnosis_info?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center" }}>
                                            <div className='itemfor'>
                                                <p className='title' style={{ textAlign: "right", width: "200px" }}>{index + 1}-نوع تعمیر :</p>
                                                <p className='text'>
                                                    <span>{item?.type_of_repair ? item?.type_of_repair : "ثبت نشده"}</span>
                                                </p>
                                            </div>
                                            <div className='itemfor'>
                                                <p className='title' style={{ textAlign: "right", width: "200px" }}>تعمیرکار :</p>
                                                <p className='text'>
                                                    <span>{item?.type_of_repair ? item?.repairman_info?.user_info?.personnel?.fullname : "ثبت نشده"}</span>
                                                </p>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <div className='itemfor'>
                                                <p className='title'>زمان تقریبی شروع :</p>
                                                <p className='text'>
                                                    <span>{item?.approximate_start_time_jalali ? item?.approximate_start_time_jalali.split("+")[0] : "ثبت نشده"}</span>
                                                </p>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <div className='itemfor'>
                                                <p className='title'>زمان تقریبی پایان :</p>
                                                <p className='text'>
                                                    <span>{item?.approximate_end_time_jalali ? item?.approximate_end_time_jalali.split("+")[0] : "ثبت نشده"}</span>
                                                </p>
                                            </div>
                                        </Grid>
                                    </Grid>


                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={5}>
                                            <div className='itemfor'>
                                                <p className='title'>زمان واقعی شروع :</p>
                                                <p className='text'>
                                                    <span>{currentDetail[0]?.time_to_troubleshoot_info[index]?.exact_start_time_jalali ? currentDetail[0]?.time_to_troubleshoot_info[index]?.exact_start_time_jalali.split("+")[0] : "ثبت نشده"}</span>
                                                </p>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <div className='itemfor'>
                                                <p className='title'>زمان واقعی پایان :</p>
                                                <p className='text'>
                                                    <span>{currentDetail[0]?.time_to_troubleshoot_info[index]?.exact_end_time_jalali ? currentDetail[0]?.time_to_troubleshoot_info[index]?.exact_end_time_jalali.split("+")[0] : "ثبت نشده"}</span>
                                                </p>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <div className='itemfor'>
                                                <p className='title'>تاخیر در شروع :</p>
                                                <p className='text'>
                                                    <span>{currentDetail[0]?.time_to_troubleshoot_info[index]?.delayed_start ? currentDetail[0]?.time_to_troubleshoot_info[index]?.delayed_start : "ندارد"}</span>
                                                </p>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <div className='itemfor'>
                                                <p className='title'>تاخیر در پایان :</p>
                                                <p className='text'>
                                                    <span>{currentDetail[0]?.time_to_troubleshoot_info[index]?.delayed_end ? currentDetail[0]?.time_to_troubleshoot_info[index]?.delayed_end : "ندارد"}</span>
                                                </p>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <div className='itemfor'>
                                                <p className='title'>تعجیل در پایان :</p>
                                                <p className='text'>
                                                    <span>{currentDetail[0]?.time_to_troubleshoot_info[index]?.end_with_haste ? currentDetail[0]?.time_to_troubleshoot_info[index]?.end_with_haste : "ندارد"}</span>
                                                </p>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <div className='itemfor'>
                                                <p className='title'>تعجیل در شروع :</p>
                                                <p className='text'>
                                                    <span>{currentDetail[0]?.time_to_troubleshoot_info[index]?.start_with_haste ? currentDetail[0]?.time_to_troubleshoot_info[index]?.start_with_haste : "ندارد"}</span>
                                                </p>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Divider variant="inset" component="span" sx={{ width: "100%", marginY: "3rem" }} />
                                </React.Fragment>
                            ))}
                        </div>
                    </Grid>
                </Grid>
            </div>
        </ShowAllStyle>
    );
};

export default ShowAllForPlanning;
