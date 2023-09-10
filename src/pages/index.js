import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function Home() {
    const [currentAccount, setCurrentAccount] = useState(null);

    const requestAccountAccess = async () => {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts);
            console.log(accounts);
        } catch (err) {
            if (err.code === 4001) {
                console.log("Please connect to MetaMask.");
            } else {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        // Retrieve from localStorage on component mount
        const storedAccount = localStorage.getItem("currentAccount");
        if (storedAccount) {
            setCurrentAccount(JSON.parse(storedAccount));
        }
    }, []);

    useEffect(() => {
        // Store to localStorage on state change
        if (currentAccount) {
            localStorage.setItem(
                "currentAccount",
                JSON.stringify(currentAccount)
            );
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
                    Account:
                    {currentAccount ? (
                        <ul>
                            {currentAccount.map((account, index) => (
                                <li key={index}>{account}</li>
                            ))}
                        </ul>
                    ) : (
                        "Not Connected"
                    )}
                </h2>
            </div>
        </>
    );
}
