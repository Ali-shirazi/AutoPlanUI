import React from 'react';

//Assets
import { ChartItemWrapper } from './chart-item.style';

//Components

const ChartItem = ({ title, percent, color, isPerson = false }) => {
    return (
        <ChartItemWrapper color={color}>
            <div>
                <span className='circle'></span>
                {title.includes("تعداد") ? (
                <p>{title}</p>
                ) :(
                    <p>درصد پذیرش {title}</p>
                )}
            </div>
            {!title.includes("تعداد") ? (
                <p className='percent'>
                    {percent ? (isPerson ? 'نفر' : '٪') : null} {percent}
                </p>
            ) : (
                <p className='percent'>
                     {percent}
                </p>
            )}
        </ChartItemWrapper>
    );
};

export default ChartItem;
