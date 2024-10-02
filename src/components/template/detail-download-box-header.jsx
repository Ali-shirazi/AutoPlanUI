import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Axios from '../../configs/axios';

//Assets
import { HeaderWrapper } from './detail-box-header.style';

//Components
import FormButton from '../form-groups/form-button';

const DetailDownloadBoxHeader = ({ title, buttonText, link }) => {

    const onClick = () => {
        Axios.get(link).then(res => {
            console.log(res.data.link);
            window.location.href = process.env.REACT_APP_BASE_URL + res.data.link 
        })
    }

    return (
        <HeaderWrapper>
            <p>{title}</p>
                <FormButton onClick={onClick} text={buttonText} width={'fit-content'} fontSize={12} />
        </HeaderWrapper>
    );
};

export default DetailDownloadBoxHeader;

// 