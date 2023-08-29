import { createTheme } from '@mui/material/styles'
import './variables.sass'

const theme = createTheme({
    palette: {
        primary: {
            main: '#0797FF',
        },
        secondary: {
            main: '#B1C9DD',
        },
    },
    components: {
        MuiDialog: {
            styleOverrides: {
                root: {
                    "& .MuiPaper-root": { 
                        width: "400px",
                        borderRadius: '10px',
                        padding: '15px'
                    },
                    "& .MuiButton-root": { 
                        textTransform: 'none'
                    },
                    "& .MuiDialogTitle-root": { 
                        fontWeight: '700',
                        fontSize: '16px',
                    },
                }
            }
        },
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    "& .MuiSnackbarContent-root": {
                        width: 'auto',
                    }
                }
            }
        }
    }
})

export default theme
