import "@/styles/globals.css";

import { useEffect } from "react";

import { MetaMaskSDK } from "@metamask/sdk";
import {
    initializeSDK,
    listenForAccountChanges,
    listenForChainChanges,
    terminateSDK,
} from "@/functions/metamaskFunctions";
import { AirstackProvider } from "@airstack/airstack-react";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }) {
    useEffect(() => {
        const setup = async () => {
            await initializeSDK();

            listenForAccountChanges((account) => {
                console.log("Account changed:", account);
            });

            listenForChainChanges((chain) => {
                console.log("Chain changed:", chain);
            });
        };

        setup();

        return () => {
            terminateSDK(); // Cleanup logic
        };
    }, []);
    return (
        <>
            <AirstackProvider apiKey="919d17d75b9f495282b64ae0d5a10ab3">
                <Component {...pageProps} />
                <Toaster />
            </AirstackProvider>
        </>
    );
}
