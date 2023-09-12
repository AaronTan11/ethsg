import NavBar from "@/components/navBar";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import axios from "axios";
import geckoMap from "@/lib/geckomap.json";

const CustomPieChart = dynamic(() => import("@/components/CustomPieChart"), {
    ssr: false,
});

const walletData = {
    data: {
        Ethereum: {
            TokenBalance: [
                {
                    tokenAddress: "0xd88e87cd53d5b3c88c07bdb4715a39b75d6e7870",
                    amount: "350",
                    token: {
                        name: "$ SolFi.Vision",
                        symbol: "SolFi.Vision",
                    },
                },
            ],
        },
        Polygon: {
            TokenBalance: [
                {
                    tokenAddress: "0x2aad6b23c189b82e50d8c24c8c1c6058a3ef9960",
                    amount: "1024000000",
                    token: {
                        name: "DogX.AI NFT",
                        symbol: "DogX.AI NFT",
                    },
                },
                {
                    tokenAddress: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                    amount: "170157054655638",
                    token: {
                        name: "Wrapped Ether",
                        symbol: "WETH",
                    },
                },
                {
                    tokenAddress: "0x78a0a62fba6fb21a83fe8a3433d44c73a4017a6f",
                    amount: "773785167770281163460",
                    token: {
                        name: "Open Exchange Token",
                        symbol: "OX",
                    },
                },
                {
                    tokenAddress: "0xaf6b1a3067bb5245114225556e5b7a52cf002752",
                    amount: "50000000000",
                    token: {
                        name: "$ xBets.org",
                        symbol: "$ Free Claim and Play",
                    },
                },
                {
                    tokenAddress: "0xfe7574959c595d7a4f7a652f9ecaa420824447ed",
                    amount: "15165247052966241465",
                    token: {
                        name: "Escrowed Path",
                        symbol: "EPATH",
                    },
                },
                {
                    tokenAddress: "0x07ca46b04982a4326e760b07db4bed59f967fa06",
                    amount: "86581180100000000000000",
                    token: {
                        name: "AkRP.org",
                        symbol: "Visit [https://akrp.org]",
                    },
                },
                {
                    tokenAddress: "0x8a6b62f5501410d179641e731a8f1cecef1c28ec",
                    amount: "1497000000000000000000",
                    token: {
                        name: "PolygonClassics.com",
                        symbol: "PolygonClassics.com",
                    },
                },
                {
                    tokenAddress: "0x403e967b044d4be25170310157cb1a4bf10bdd0f",
                    amount: "320000000000000000",
                    token: {
                        name: "Aavegotchi FUD",
                        symbol: "FUD",
                    },
                },
                {
                    tokenAddress: "0x42e5e06ef5b90fe15f853f59299fc96259209c5c",
                    amount: "80000000000000000",
                    token: {
                        name: "Aavegotchi KEK",
                        symbol: "KEK",
                    },
                },
                {
                    tokenAddress: "0x6a3e7c3c6ef65ee26975b12293ca1aad7e1daed2",
                    amount: "420000000000000000",
                    token: {
                        name: "Aavegotchi ALPHA",
                        symbol: "ALPHA",
                    },
                },
                {
                    tokenAddress: "0x3c0bd2118a5e61c41d2adeebcb8b7567fde1cbaf",
                    amount: "15010800100000",
                    token: {
                        name: "Cookie",
                        symbol: "CKIE",
                    },
                },
            ],
        },
    },
};

// Get a past date as a UNIX timestamp
// `daysAgo` is the number of days in the past from today
function getPastTimestamp(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return Math.floor(date.getTime() / 1000);
}

// Get a future date as a UNIX timestamp
// `daysAhead` is the number of days in the future from today
function getFutureTimestamp(daysAhead) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return Math.floor(date.getTime() / 1000);
}

// Your analyzeWallet function
async function analyzeWallet(walletData, geckoMap) {
    const riskAssessment = [];
    let totalMarketCap = 0;
    let totalVolume = 0;

    const { ethereumTokenBalances, polygonTokenBalances } = walletData;

    const allBalances = [
        { blockchain: "Ethereum", balances: ethereumTokenBalances },
        { blockchain: "Polygon", balances: polygonTokenBalances },
    ];

    for (const { blockchain, balances } of allBalances) {
        for (const balance of balances) {
            const {
                tokenAddress,
                amount,
                token: { name, symbol },
            } = balance;

            let usableName = null;
            for (const word of name.split(" ")) {
                if (geckoMap[word]) {
                    usableName = word;
                    break;
                }
            }

            if (!usableName) continue;

            const coingeckoData = await fetchCoinGeckoData(
                geckoMap[usableName]
            );
            if (!coingeckoData) continue;

            const avgMarketCap =
                coingeckoData.market_caps.reduce(
                    (acc, [_, val]) => acc + val,
                    0
                ) / coingeckoData.market_caps.length;

            const avgVolume =
                coingeckoData.total_volumes.reduce(
                    (acc, [_, val]) => acc + val,
                    0
                ) / coingeckoData.total_volumes.length;

            totalMarketCap += avgMarketCap;
            totalVolume += avgVolume;

            const metrics = {
                blockchain,
                tokenAddress,
                avgMarketCap,
                avgVolume,
            };

            riskAssessment.push(metrics);
        }
    }

    for (const item of riskAssessment) {
        item.marketShare = item.avgMarketCap / totalMarketCap;
        item.volumeShare = item.avgVolume / totalVolume;
    }

    return riskAssessment;
}

// Function to fetch CoinGecko data
async function fetchCoinGeckoData(tokenSymbol) {
    // Step 2: Look up the CoinGecko ID using the map
    const coinId = geckoMap[tokenSymbol];
    if (!coinId) return null;

    const past = getPastTimestamp(7);
    const future = getFutureTimestamp(7);
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${past}&to=${future}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export default function Home() {
    const [riskResult, setRiskResult] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");

    useEffect(() => {
        const storedPortfolioData = localStorage.getItem("portfolioData");
        if (storedPortfolioData) {
            const parsedPortfolioData = JSON.parse(storedPortfolioData);
            const performRiskAssessment = async () => {
                const riskMetrics = await analyzeWallet(parsedPortfolioData);
                setRiskResult(riskMetrics);
                setPrompt(riskMetrics);
                if (riskMetrics.length > 0) {
                    getResponseFromOpenAI();
                }
            };
            performRiskAssessment().catch((err) => {
                console.error("An error occurred during risk assessment:", err);
            });

            console.log(parsedPortfolioData);
        }
    }, []);

    const getResponseFromOpenAI = async () => {
        setResponse("");
        console.log("Getting response from OpenAI...");
        setIsLoading(true);
        const response = await fetch("/api/openai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: "tell me the analysis of these " + prompt,
            }),
        });

        const data = await response.json();
        setIsLoading(false);
        console.log(data.text);
        setResponse(data.text);
    };

    return (
        <>
            <NavBar />
            <main className="ml-28 space-y-6 py-6">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Portfolio
                </h1>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        $850
                    </h3>
                    <div className="flex space-x-11 max-w-5xl">
                        <CustomPieChart />
                        <div className="space-y-10"></div>
                    </div>
                    <div className="space-y-10">
                        {riskResult.length > 0 ? (
                            riskResult.map((item, index) => (
                                <div key={index}>
                                    <p>Blockchain: {item.blockchain}</p>
                                    <p>Token: {item.tokenAddress}</p>
                                    <p>Market Share: {item.marketShare}</p>
                                    <p>Volume Share: {item.volumeShare}</p>
                                </div>
                            ))
                        ) : (
                            <>
                                <p>Data not available or Coin not found.</p>
                                <p>{response}</p>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
