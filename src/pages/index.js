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

    return (
        <>
            <div className="flex justify-center items-center flex-col h-screen space-y-7">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Portfolio Management
                </h1>
                <Button
                    // className="bg-slate-400 px-6 py-3 rounded-md font-semibold"
                    onClick={requestAccountAccess}
                >
                    Connect to Metamask
                </Button>
                <h2>
                    Account:{" "}
                    {currentAccount ? currentAccount[0] : "Not Connected"}
                </h2>
            </div>
        </>
    );
}
