import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "../themes/theme";
import { SWRConfig } from "swr";
import { AuthProvider, UIContext, UIProvider } from "../context";
import { CartProvider } from "../context/cart";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { NextPage } from "next";
import { PropsWithChildren, useContext } from "react";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_ID || "" }}>
        <SWRConfig
          value={{
            fetcher: (resourse, init) => fetch(resourse, init).then((res) => res.json()),
          }}
        >
          <AuthProvider>
            <UIProvider>
              <AllProvider>
                <Component {...pageProps} />
              </AllProvider>
            </UIProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  );
}

interface PropsProvider extends PropsWithChildren {}
const AllProvider: NextPage<PropsProvider> = ({ children }) => {
  const { mode } = useContext(UIContext);
  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
};

export default MyApp;
