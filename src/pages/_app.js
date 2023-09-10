import "@/styles/globals.css";

import { useEffect } from "react";

import { MetaMaskSDK } from "@metamask/sdk";
import {
    initializeSDK,
    listenForAccountChanges,
    listenForChainChanges,
    terminateSDK,
} from "@/metamaskSDK/metamaskFunctions";

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
            <Component {...pageProps} />
        </>
    );
}
