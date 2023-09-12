// metamaskFunctions.js

import { MetaMaskSDK, SDKProvider } from "@metamask/sdk";
import {
    ConnectionStatus,
    EventType,
    ServiceStatus,
} from "@metamask/sdk-communication-layer";

export let sdk;
export let activeProvider;

// Initialize SDK
export const initializeSDK = async () => {
    sdk = new MetaMaskSDK({
        dappMetadata: {
            name: "NEXTJS demo",
            url: window.location.host,
        },
        logging: {
            developerMode: false,
        },
        storage: {
            enabled: true,
        },
    });
    await sdk.init();
    activeProvider = sdk.getProvider();
};

// Connect to MetaMask
export const connect = async () => {
    if (!window.ethereum) {
        throw new Error("invalid ethereum provider");
    }
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [],
    });
    return accounts[0];
};

// Listen for account changes
export const listenForAccountChanges = (callback) => {
    window.ethereum?.on("accountsChanged", (accounts) => {
        callback(accounts[0]);
    });
};

// Listen for chain changes
export const listenForChainChanges = (callback) => {
    window.ethereum?.on("chainChanged", (chain) => {
        callback(chain);
    });
};

// Sign Typed Data
export const eth_signTypedData_v4 = async (from, msgParams) => {
    try {
        if (!from) {
            alert("Invalid account -- please connect first");
            return;
        }
        const params = [from, msgParams];
        const method = "eth_signTypedData_v4";
        const response = await window.ethereum?.request({
            method,
            params,
        });
        return response;
    } catch (e) {
        console.log(e);
    }
};

// Terminate SDK
export const terminateSDK = () => {
    sdk?.terminate();
};
