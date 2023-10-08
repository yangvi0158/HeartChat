import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";

import { UserProvider } from "@/app/contexts/UserContext";
import { SocketProvider } from "@/app/contexts/SocketContext";
import { RoomProvider } from "@/app/contexts/RoomContext";
import { SnackBarProvider } from "@/app/hooks/useSnackBar";
import { ZoomInImageProvider } from "@/app/hooks/useZoomInImage";
import theme from "@/app/styles/theme";
import "@/app/styles/global.sass";
import "@/app/styles/normalize.css";

const inter = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <SocketProvider>
        <RoomProvider>
          <UserProvider>
            <main className={inter.className}>
              <ThemeProvider theme={theme}>
                <AnimatePresence mode="wait">
                  <SnackBarProvider>
                    <ZoomInImageProvider>
                      <Component {...pageProps} />
                    </ZoomInImageProvider>
                  </SnackBarProvider>
                </AnimatePresence>
              </ThemeProvider>
            </main>
          </UserProvider>
        </RoomProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
