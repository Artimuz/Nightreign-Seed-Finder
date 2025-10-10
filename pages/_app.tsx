import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

import ErrorBoundary from "../components/ErrorBoundary";
import { LocaleProvider } from "@/hooks/LocaleContext";
import { generateSessionId } from "../utils/browserInfo";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize session tracking
    if (!sessionStorage.getItem("sessionStart")) {
      sessionStorage.setItem("sessionStart", Date.now().toString());
    }
    
    if (!sessionStorage.getItem("sessionId")) {
      sessionStorage.setItem("sessionId", generateSessionId());
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Find patterns in Elden Ring Nightreign maps" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ErrorBoundary>
        <LocaleProvider>
          <Component {...pageProps} />
        </LocaleProvider>
      </ErrorBoundary>
    </>
  );
}
