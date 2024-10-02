import React from 'react';
import { HeaderWrapper } from './detail-box-header.style';
import FormButton from '../form-groups/form-button';
import { Box } from '@mui/material';

const DetailDownloadBoxHeaderOnClick = ({ title, onClick, buttonText, Icon }) => {
    return (
        <HeaderWrapper>
            <p>{title}</p>
            <Box sx={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",gap:"2rem"}}>
                <FormButton onClick={onClick} text={buttonText} width={'fit-content'} fontSize={12} />
                {Icon ? (
                    <Icon /> // Render the Icon as a React component
                ) : null}
            </Box>
        </HeaderWrapper>
    );
};

export default DetailDownloadBoxHeaderOnClick;
