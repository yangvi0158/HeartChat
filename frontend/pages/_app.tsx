import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'

import { SnackBarProvider } from '@/app/hooks/useSnackBar';
import theme from '@/app/styles/theme';
import '@/app/styles/global.sass'
import '@/app/styles/normalize.css';

const inter = Inter({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function App({
  Component, pageProps: { session, ...pageProps }
}: AppProps) {
    return (
      <SessionProvider session={session}>
        <main className={inter.className}>
          <ThemeProvider theme={theme}>
              <AnimatePresence mode="wait">
                <SnackBarProvider>
                  <Component {...pageProps}/>
                </SnackBarProvider>
              </AnimatePresence>
          </ThemeProvider>
        </main>
      </SessionProvider>
    )
}