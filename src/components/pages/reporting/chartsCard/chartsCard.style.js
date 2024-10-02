import styled from '@emotion/styled';

export const OptionsWrapper = styled.div(() => ({
    '& .options': {
        display: 'flex',
        marginTop: '40px',
        marginBottom: '30px',
        gap: '10px',

        '& .option_item': {
            flexGrow: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',

            p: {
                fontWeight: '700'
            }
        },

        select: {
            fontFamily: 'main',
            width: '100%',
            border: 'none',
            boxShadow: '0px 4px 14px 0px #0000002d',
            borderRadius: '8px',
            padding: '7px',
            fontSize: '12px'
        }
    },

    '& .fields': {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        marginTop: "3rem",

        '& .field': {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',

            p: {
                fontWeight: '700',
                fontSize: '15px',
                marginBottom: '10px'
            },

            '& .circle': {
                boxShadow: '0px 0px 14px 0px #0000004d',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                fontWeight: '700',
            }
        }
    }
}));
