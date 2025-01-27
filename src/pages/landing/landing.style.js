// import styled from '@emotion/styled';
// import bgPic from './../../assets/images/landing/background-plumber.png';

// export const LandingWrapper = styled.div(props => ({
//     backgroundColor: props.theme.colors.white,

//     '& .container': {
//         '& .img_wrapper': {
//             position: 'relative',

//             '&::after': {
//                 content: '""',
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 background: 'linear-gradient(0deg, rgba(255,255,255,1) 14%, rgba(255,255,255,0) 25%)'
//             }
//         },

//         img: {
//             width: '100%'
//         },

//         '& .introduce': {
//             padding: '150px 250px',

//             '@media(max-width : 900px)': {
//                 padding: '150px 50px'
//             }
//         },

//         '& .introduce_text': {
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             fontSize: '62px',
//             fontWeight: '1000',
//             lineHeight: '96px',

//             '@media(max-width : 1200px)': {
//                 fontSize: '45px'
//             },

//             '@media(max-width : 1000px)': {
//                 fontSize: '35px',
//                 textAlign: 'center',
//                 whiteSpace: 'nowrap'
//             },

//             '& p:nth-of-type(2)': {
//                 color: props.theme.colors.secondary
//             },

//             '& p:nth-of-type(3)': {
//                 color: props.theme.colors.mainColor
//             }
//         },

//         '& .services': {
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundImage: `url(${bgPic})`,
//             color: props.theme.colors.mainColor,
//             height: '100vh',
//             padding: '150px 250px',

//             '@media(max-width : 1200px)': {
//                 padding: '150px 50px'
//             },

//             '& .container': {
//                 height: '100%',
//                 color: 'white',
//                 backdropFilter: 'blur(30px)',
//                 lineHeight: '35px',
//                 textAlign: 'justify',
//                 padding: '30px',
//                 borderRadius: '25px',

//                 '& .title': {
//                     fontSize: '35px',
//                     fontWeight: 700,
//                     marginBottom: '20px'
//                 },

//                 '& .services_text': {}
//             }
//         },

//         '& .about': {
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundImage: `url(${bgPic})`,
//             color: props.theme.colors.mainColor,
//             height: '100vh',
//             padding: '150px 250px',

//             '@media(max-width : 900px)': {
//                 padding: '150px 50px'
//             },

//             '& .container': {
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//                 height: '100%',
//                 lineHeight: '35px',
//                 textAlign: 'justify',
//                 padding: '30px',

//                 '& .title': {
//                     fontSize: '35px',
//                     fontWeight: 1000,
//                     marginBottom: '20px',

//                     '@media(min-width: 900px) and (max-width: 1150px)': {
//                         fontSize: '25px'
//                     }
//                 },

//                 '& .about_text': {
//                     '@media(max-width : 900px)': {
//                         textAlign: 'center'
//                     },

//                     '@media(min-width: 900px) and (max-width: 1150px)': {
//                         fontSize: '12px'
//                     }
//                 }
//             }
//         },

//         '& .contact': {
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundImage: `url(${bgPic})`,
//             color: props.theme.colors.mainColor,
//             height: '100vh',
//             padding: '150px 250px',

//             '@media(max-width : 900px)': {
//                 padding: '0 50px 150px 50px'
//             },

//             '& .container': {
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//                 height: '100%',
//                 lineHeight: '35px',
//                 textAlign: 'justify',
//                 padding: '30px',
//                 '@media(max-width : 900px)': {
//                     alignItems: 'center'
//                 },

//                 '& .title': {
//                     fontSize: '35px',
//                     fontWeight: 1000,
//                     marginBottom: '20px',
//                     whiteSpace: 'nowrap'
//                 },

//                 '& .contact_text': {
//                     '& .contact_item_wrapper': {
//                         display: 'flex',
//                         gap: '70px',

//                         '@media(max-width : 1200px)': {
//                             flexDirection: 'column',
//                             gap: '0'
//                         }
//                     },

//                     '& .contact_item': {
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '5px',

//                         img: {
//                             width: '20px'
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }));
import styled from '@emotion/styled';
import bgPic from '../../assets/images/landing/background-plumber.png';
import bgimg from "../../assets/images/global/bg.svg";
export const LandingWrapper = styled.div(props => ({
    backgroundColor: props.theme.colors.white,
    height: '100vh', // Ensure the wrapper takes the full height of the viewport
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: `url(${bgimg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', // Ensure background image covers the entire container
    backgroundPosition: 'center', // Center the background image
    overflowX: 'hidden', // Prevent horizontal overflow

    '& .container': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        '@media (max-width: 900px)': {
            padding: '1rem',
        },

        '& .introduce': {
            textAlign: 'center',
            width: "90%",

            '& .introduce_text': {
                fontSize: '2rem',
                lineHeight: '1.5',
                marginTop: '1rem',

                '@media (max-width: 600px)': {
                    fontSize: '1.5rem',
                },

                '& p': {
                    margin: '0.5rem 0',
                },
            },
        },

        '& .img_wrapper': {
            width: '100%',
            height: "100%",
            textAlign: 'center',
            marginTop: '2rem',
            display: "flex",
            flexDirection:"column",
            justifyContent: "start",
            alignItems:"center",
        },
    },
}));
