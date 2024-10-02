import React from 'react';
import { useLocation } from 'react-router-dom';
//Assets
import { ModalStyle } from './modal.styles';
import bg from '../../assets/images/global/bg.svg';
import printIcon from "../../assets/images/printer-svgrepo-com.svg";
//MUI
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { Typography } from '@mui/material';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});
const ModalForPlanning = ({DetailsIsModalOpen,setDetailsIsModalOpen, children, bgStatus = false, maxWidth = 'lg', fullScreen = false }) => {
    // Print function
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html dir="rtl"><head><title>Print</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(document.querySelector('.childrenStyle').innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };
    const location = useLocation();
    // console.log(location, "location");

    return (
        <ModalStyle bgStatus={bgStatus} bg={bg}>
            <Dialog
                open={DetailsIsModalOpen}
                TransitionComponent={Transition}
                keepMounted={false}
                onClose={() => {
                    setDetailsIsModalOpen && setDetailsIsModalOpen(false);
                }}
                fullWidth={true}
                maxWidth={maxWidth}
                disablePortal
                scroll='body'
                fullScreen={fullScreen}
            >

                <div className='childrenStyle'>
                    {children}
                </div>
                <div style={{ position: 'relative', width: "10rem", height: "10rem" }}>
                    {/* Print Button */}
                    {location.pathname == "/corrective" ?
                        <button
                            style={{
                                position: 'absolute',
                                top: 50,
                                right: 100,
                                zIndex: 1000,
                            }}
                            onClick={handlePrint}
                        >
                            <img src={printIcon} alt="print-icon" style={{ width: "3rem", height: "3rem", backgroundColor: "white" }} />
                            <Typography>پرینت</Typography>
                        </button> : ""
                    }
                    {/* Modal Content */}

                </div>
            </Dialog>

        </ModalStyle>
    );
};

export default ModalForPlanning;
