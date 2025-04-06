// app/providers.tsx
"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'react-toastify/dist/ReactToastify.css';
import './app.css';
import { Providers as ReduxProviders } from "@/redux/provider";

// Move your theme definition here
export const theme = extendTheme({
  fonts: {
    inter: 'var(--font-inter)',
  },
});

// Configure NProgress
NProgress.configure({ showSpinner: true });

export function ChakraWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Setup router events
    Router.events.on('routeChangeStart', (url) => {
      console.log(`Loading: ${url}`);
      NProgress.start();
    });
    Router.events.on('routeChangeComplete', () => NProgress.done());
    Router.events.on('routeChangeError', () => NProgress.done());

    // Cleanup
    return () => {
      Router.events.off('routeChangeStart', () => NProgress.start());
      Router.events.off('routeChangeComplete', () => NProgress.done());
      Router.events.off('routeChangeError', () => NProgress.done());
    };
  }, []);

  return (
    <ReduxProviders>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          {children}
          <ToastContainer />
        </ChakraProvider>
      </CacheProvider>
    </ReduxProviders>
  );
}