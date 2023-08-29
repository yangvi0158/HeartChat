import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

export const SnackBarContext = createContext(null)

function useSnackBar() {
    return useContext(SnackBarContext)
}

type ProviderProps = {
    children: ReactNode
}

type ConfigTypes = {
    text: string,
    status: 'error' | 'warning' | 'success' | 'info'
}

const SnackBarProvider = ({ children }: ProviderProps) => {
    const [config, setConfig] = useState<ConfigTypes>({
        text: '',
        status: 'info',
    })

    const { text, status } = config

    useEffect(() => {
        if (text) {
            setTimeout(() => {
                setConfig(() => ({ 
                    text: '',
                    status: 'info'
                }))
            }, 2500)
        }
    }, [text])

    return (
        <SnackBarContext.Provider value={setConfig}>
            {children}
            <Snackbar
                open={!!text}
                key={`snackbar` + `${text}`}
                autoHideDuration={2000}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <MuiAlert severity={status}>{text}</MuiAlert>
            </Snackbar>
        </SnackBarContext.Provider>
    )
}

export { SnackBarProvider, useSnackBar }
