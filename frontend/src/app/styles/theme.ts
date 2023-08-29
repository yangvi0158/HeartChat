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
        info: {
            main: '#FFFFFF',
        },
    },
})

export default theme
