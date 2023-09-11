import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/landingNav";
import { useRouter } from 'next/router';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

import {
    connect,
    listenForAccountChanges,
} from "@/metamaskSDK/metamaskFunctions";

export default function Home() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const account = await connect();
                setCurrentAccount(account);
                setError(null); // Clear any previous error messages on success
                router.push('/wallet');
            } catch (err) {
                setError('Please try again. ' + err.message);
            }
        }

        fetchData(); // Call the async function within useEffect
    }, [router]);

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
            router.push('/wallet');
        } catch (err) {
            setError('Please try again. ' + err.message);
        }
    };

    return (
        <>
            <LandingNav />
            <div className="flex space-y-7">
                <div className="md:w-[50%]">
                    <Image
                        src={'https://images.ctfassets.net/63bmaubptoky/51YYDgW_1geL1OYLw2ugGYgH-ohF8khvUUMqBStkxcg/b19a4ed7698597235d983dcebcd54dea/CAP-INTL-Header-What-is-asset-management-DLVR.png'}
                        alt="Picture of the author"
                        width="700"
                        height="200"
                    />
                </div>
                <div className="p-6 pt-10">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Portfolio Management
                    </h1>
                    <br />
                    <p className="font-mono">Elevate your crosschain portfolio management with unrivaled visibility and advanced analytics.</p>
                    <br />
                    <Button onClick={requestAccountAccess}>
                        Let's get start
                    </Button>
                </div>
            </div>
            <div className="flex space-x-10 justify-center items-center pt-10 md:w-[100%]">
                <div className="md:w-[10%] text-center font-mono">
                    <CIcon icon={icon.cilDollar} />
                    Clear Visuabiity
                </div>
                <div className="md:w-[10%] text-center font-mono">
                    <CIcon icon={icon.cilMagnifyingGlass} />
                    View every token in own wallet
                </div>
                <div className="md:w-[10%] text-center font-mono" >
                    <CIcon icon={icon.cilChartLine} />
                    Understanding the performance
                </div>
            </div>
        </>
    );
}
