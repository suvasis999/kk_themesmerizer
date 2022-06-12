import { ChakraProvider} from "@chakra-ui/react";
import { AppProps } from "next/dist/next-server/lib/router/router";
//import type { AppProps } from "next/app";
import "../styles/globals.css";
import Head from "next/head";
function MyApp({ Component, pageProps }: AppProps) {
 
  return (
    <>
    <Head>
      <title>KK FOREVER</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
    </Head>
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
    </>
  );
}

export default MyApp;
