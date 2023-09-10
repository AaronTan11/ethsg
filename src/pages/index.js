import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    connect,
    listenForAccountChanges,
} from "@/metamaskSDK/metamaskFunctions";

export default function Home() {
    const [currentAccount, setCurrentAccount] = useState(null);

    const requestAccountAccess = async () => {
        const account = await connect();
        setCurrentAccount(account);
    };

    useEffect(() => {
        // Retrieve from localStorage on component mount
        const storedAccount = localStorage.getItem("currentAccount");
        if (storedAccount) {
            setCurrentAccount(storedAccount);
        }

        // Listen for account changes
        const unsubscribe = listenForAccountChanges((newAccount) => {
            setCurrentAccount(newAccount);
        });

        // Cleanup
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);

    useEffect(() => {
        // Store to localStorage on state change
        if (currentAccount) {
            localStorage.setItem("currentAccount", currentAccount);
        }
    }, [currentAccount]);

    return (
        <>
            <div className="flex justify-center items-center flex-col h-screen space-y-7">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Portfolio Management
                </h1>
                <Button onClick={requestAccountAccess}>
                    Connect to Metamask
                </Button>
                <h2>
                    Account: {currentAccount ? currentAccount : "Not Connected"}
                </h2>
            </div>
        </>
    );
}
