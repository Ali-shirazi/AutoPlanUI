import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

export default function InputGuide() {
    return (
        <div>
            <Tooltip title="Lorem ipsum">
                <IconButton>
                    <HelpRoundedIcon />
                </IconButton>
            </Tooltip>
        </div>
    )
}
