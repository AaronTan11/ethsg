import "@/styles/globals.css";

import { useEffect } from "react";

import { MetaMaskSDK } from "@metamask/sdk";

import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet],
    [publicProvider()]
);

const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
});

export default function App({ Component, pageProps }) {
    useEffect(() => {
        const initProvider = async () => {
            if (typeof window !== "undefined") {
                const options = {
                    injectProvider: false,
                    communicationLayerPreference: "webrtc",
                };
                const MMSDK = new MetaMaskSDK(options);
                try {
                    const ethereum = await MMSDK.getProvider();
                    // Do something with the provider

                    ethereum.request({
                        method: "eth_requestAccounts",
                        params: [],
                    });
                } catch (error) {
                    console.error("Error getting provider:", error);
                }
            }
        };

        initProvider();
    }, []);
    return (
        <>
            <WagmiConfig config={config}>
                <Component {...pageProps} />
            </WagmiConfig>
        </>
    );
}
