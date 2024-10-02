import React from 'react';
import { Grid } from '@mui/material';

//Assets
import { ReportingWrapper } from './reporting.style';

//Components
import FirstChart from '../../components/pages/reporting/chartsCard/firstChart';
import SecondChart from '../../components/pages/reporting/chartsCard/secondChart';
import ThirdChart from '../../components/pages/reporting/chartsCard/thirdChart';
import FourthChart from '../../components/pages/reporting/chartsCard/fourthChart';
import FifthChart from '../../components/pages/reporting/chartsCard/fifthChart';
import Reporttable from '../../components/pages/reporting/Tables/table';

const Reporting = () => {
    return (
        <ReportingWrapper>
            <Grid container spacing={1.5}>
                <Grid item xs={12} >
                    <div className='item'>
                        <FirstChart />
                    </div>
                </Grid>
                <Grid item xs={12} >
                    <div className='item'>
                        <SecondChart />
                    </div>
                </Grid>
                <Grid item xs={12} >
                    <div className='item'>
                        <ThirdChart />
                    </div>
                </Grid>
                <Grid item xs={12} >
                    <div className='item'>
                        <FourthChart />
                    </div>
                </Grid>
                <Grid item xs={12} >
                    <div className='item'>
                        <FifthChart />
                    </div>
                </Grid>
            </Grid>
        </ReportingWrapper>
    );
};

export default Reporting;
