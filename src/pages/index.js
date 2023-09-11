import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/landingNav";
import { useRouter } from "next/router";

import {
    connect,
    listenForAccountChanges,
} from "@/functions/metamaskFunctions";

export default function Home() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

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

    const requestAccountAccess = async () => {
        try {
            const account = await connect();
            setCurrentAccount(account);
            setError(null); // Clear any previous error messages on success
            router.push("/wallet");
        } catch (err) {
            setError("Please try again. " + err.message);
        }
    };

    return (
        <>
            <LandingNav />
            <div className="space-y-10">
                <div className="relative flex justify-center px-4 lg:py-16">
                    <div className="max-w-7xl space-y-10">
                        <h1 className="font-[Ultra] text-4xl md:text-7xl">
                            The *ONLY* Portfolio Manager You'll Ever Need!
                        </h1>
                        <p className="font-mono text-lg md:text-2xl max-w-3xl">
                            Step into the Crypto Realm with Our Web3 Portfolio
                            Manager App – Simplify, Strategize, and Stay Groovy
                            with Your Cryptocurrencies! We'll take care of
                            everything, you're the boss!
                        </p>
                        <Button
                            onClick={requestAccountAccess}
                            className="w-full max-w-3xl font-mono text-lg md:text-2xl px-12 p-6 font-bold border-4 border-black text-black bg-yellow-500 hover:text-white"
                        >
                            Start Now!!!
                        </Button>
                    </div>
                    <Image
                        src="/mascot.png"
                        alt="mascot"
                        width="640"
                        height="640"
                        className="hidden lg:block absolute right-28 -bottom-16"
                    />
                </div>
                <div className="flex md:justify-center px-4 lg:py-16">
                    <div className="max-w-7xl space-y-10">
                        <h2 className="font-[Ultra] text-3xl md:text-6xl text-center">
                            Here's what we do for you:
                        </h2>
                        <div className="flex lg:justify-between">
                            <Image
                                src="/coinn.png"
                                alt="mascot 2"
                                width="640"
                                height="640"
                                className="hidden lg:block -ml-24"
                            />
                            <div className="flex-1 font-mono text-lg md:text-2xl max-w-3xl py-4">
                                <ul className="list-decimal space-y-8">
                                    <li>
                                        We bring the fun back to finance with
                                        eye-catching data visualizations that
                                        turn your crypto portfolio into a work
                                        of art. No more boring spreadsheets!
                                    </li>
                                    <li>
                                        Easily view your assets across different
                                        blockchains with a few clicks, just like
                                        a seasoned pro
                                    </li>
                                    <li>
                                        Even if you're a total crypto noob, our
                                        app's user-friendly interface will have
                                        you feeling like a digital currency
                                        expert in no time!
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:justify-center items-center px-4 lg:py-72 bg-yellow-500 space-y-8">
                    <h2 className="font-[Ultra] text-3xl md:text-6xl text-center">
                        Still Scrolling?
                    </h2>
                    <p className="font-mono text-lg md:text-2xl text-center">
                        Stop wasting your precious time.
                    </p>
                    <Button
                        onClick={requestAccountAccess}
                        className="max-w-3xl font-mono text-lg md:text-2xl px-12 p-6 font-bold border-4 border-black hover:bg-yellow-500 hover:text-black"
                    >
                        Connect Your Wallet!
                    </Button>
                </div>
            </div>
        </>
    );
}
