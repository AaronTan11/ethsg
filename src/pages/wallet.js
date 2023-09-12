import { useState, useEffect } from "react";
import NavBar from "@/components/navBar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { init, fetchQuery } from "@airstack/airstack-react";
import dynamic from "next/dynamic";
import CryptoTableRow from "@/components/CryptoTableRow";

const CustomPieChart = dynamic(() => import("@/components/CustomPieChart"), {
    ssr: false,
});

const defaultQuery = `query MyQuery($walletAddress: Identity!) {
  Ethereum: TokenBalances(
    input: {filter: {owner: {_eq: $walletAddress}, tokenType: {_eq: ERC20}}, blockchain: ethereum, limit: 50}
  ) {
    TokenBalance {
      tokenAddress
      amount
      token {
        name
        symbol
        decimals
      }
    }
  }
  Polygon: TokenBalances(
    input: {filter: {owner: {_eq: $walletAddress}, tokenType: {_eq: ERC20}}, blockchain: polygon, limit: 50}
  ) {
    TokenBalance {
      tokenAddress
      amount
      token {
        name
        symbol
        decimals
      }
    }
  }
}`;

const ENSQuery = `query MyQuery($walletAddress: Address!) {
  Domains(input: {filter: {resolvedAddress: {_eq: $walletAddress}}, blockchain: ethereum}) {
    Domain {
      name
    }
  }
}`;

// Initialization function, assumed to be working correctly
init("919d17d75b9f495282b64ae0d5a10ab3");

export default function Home() {
    const [searchInput, getSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const handleInput = (e) => {
        getSearchInput(e.target.value);
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            setSearchResults(e.target.value);
            console.log(searchResults);
        }
    };

    const [currentAccount, setCurrentAccount] = useState(null);
    const [walletENS, setWalletENS] = useState(null);
    const [ethereumTokenBalances, setEthereumTokenBalances] = useState([]);
    const [polygonTokenBalances, setPolygonTokenBalances] = useState([]);
    const [mantleTokenBalances, setMantleTokenBalances] = useState([]);
    const [eth, setEth] = useState(0);
    const [matic, setMatic] = useState(0);
    const [showButton, setShowButton] = useState(true);

    const getEthBalance = async (walletAddress) => {
        try {
            const apiKey = "BS93U9JSYZWDF4MYUHHENVWWCJRDG5SQ39";
            const apiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${apiKey}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === "1") {
                const ethBalanceWei = data.result;
                const ethBalance = parseFloat(ethBalanceWei) / 1e18; // Convert wei to Matic
                return ethBalance;
            } else {
                console.error(
                    "Ethereum balance API returned an error:",
                    data.message
                );
                return 0; // Return 0 if there's an error
            }
        } catch (error) {
            console.error(
                "An error occurred while fetching Ethereum balance:",
                error
            );
            return 0; // Return 0 if there's an error
        }
    };

    //pull from this API https://api.polygonscan.com/api?module=account&action=balance&address=0x8f7261a46abe7df64b37516de5f016cd2f63e899&apikey=MMWWSU76N7FWJXBD113VETSC2EKY59TBUH

    const getMaticBalance = async (walletAddress) => {
        try {
            const apiKey = "MMWWSU76N7FWJXBD113VETSC2EKY59TBUH";
            const apiUrl = `https://api.polygonscan.com/api?module=account&action=balance&address=${walletAddress}&apikey=${apiKey}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === "1") {
                // The balance is in wei, so you may want to convert it to Matic (Polygon).
                const maticBalanceWei = data.result;
                const maticBalance = parseFloat(maticBalanceWei) / 1e18; // Convert wei to Matic

                return maticBalance;
            } else {
                console.error(
                    "Polygon balance API returned an error:",
                    data.message
                );
                return 0; // Return 0 if there's an error
            }
        } catch (error) {
            console.error(
                "An error occurred while fetching Polygon balance:",
                error
            );
            return 0; // Return 0 if there's an error
        }
    };

    useEffect(() => {
        const buttonState = localStorage.getItem("showButton");
        if (buttonState !== null) {
            setShowButton(JSON.parse(buttonState));
        }
        const storedAccount = localStorage.getItem("currentAccount");
        if (storedAccount) {
            setCurrentAccount(storedAccount);
            fetchQuery(defaultQuery, { walletAddress: storedAccount })
                .then((r) => {
                    // Handle the FetchQueryReturnType here
                    const ethereumTokenBalances = r.data.Ethereum.TokenBalance;
                    const polygonTokenBalances = r.data.Polygon.TokenBalance;
                    setEthereumTokenBalances(ethereumTokenBalances ?? []);
                    setPolygonTokenBalances(polygonTokenBalances ?? []);
                })
                .catch((e) => console.error("An error occurred:", e));
            fetchQuery(ENSQuery, { walletAddress: storedAccount }).then((r) => {
                // Handle the FetchQueryReturnType here
                const domain = r.data.Domains.Domain;
                const walletENS = domain ? domain[0].name : "";
                setWalletENS(walletENS);
            });
            fetch(`/api/get-mantle?wallet=${storedAccount}`)
                .then((r) => r.json())
                .then((r) => setMantleTokenBalances(r.result ?? []));

            getMaticBalance(storedAccount).then((matic) => {
                setMatic(new Number(matic).toFixed(6));
                console.log(matic);
            });

            getEthBalance(storedAccount).then((eth) =>
                setEth(new Number(eth).toFixed(6))
            );
        }
    }, []);

    const [totalSum, setTotalSum] = useState(0);
    // Define the function to handle row value change
    const handleRowValueChange = (value) => {
        
        setTotalSum(value);
    };
    const saveToPortfolio = () => {
        const portfolioData = {
            ethereumTokenBalances,
            polygonTokenBalances,
        };
        localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
        setShowButton(false); // Hide the button
        localStorage.setItem("showButton", JSON.stringify(false)); // Save state to localStorage
    };
    const ethbalance = 0.0049 * 1557.02;

    return (
        <>
            <NavBar />
            <div className="p-10">
                <div className="flex justify-between md:w-[50%] bg-slate-100 p-6 rounded-xl	">
                    <div>
                        <p> ENS: {walletENS || "N/A"} </p>
                        <br />
                        <p> Wallet Address: {currentAccount} </p>
                        <br />
                        <p>{totalSum.toFixed(4)}USD</p>
                        <br />
                    </div>
                    <div>
                        {showButton && (
                            <Button
                                variant="outline"
                                onClick={saveToPortfolio}
                                className="text-black text-center border-b-2 hover:bg-slate-950 md:hover:text-white rounded-lg"
                            >
                                Add to Portfolio
                            </Button>
                        )}
                    </div>
                </div>
                <br />
                <div className="">
                    <p className="font-bold"> Assets </p>
                    <Separator />
                    <br />

          <CustomPieChart />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]"> Token </TableHead>
              <TableHead> Blockchain </TableHead>
              <TableHead className="text-right">
                {" "}
                Token Balance{" "}
              </TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eth>0 && (
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src="https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880" />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <p className="px-4"> Eth </p>
                  </div>
                </TableCell>
                <TableCell> Ethereum </TableCell>
                <TableCell className="text-right">{eth}</TableCell>
                <TableCell className="text-right">{ethbalance.toFixed(2)}</TableCell>
              </TableRow>
            ) 
            }
            {matic>0 && (
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <p className="px-4"> Matic </p>
                </div>
              </TableCell>
              <TableCell> Polygon </TableCell>
              <TableCell className="text-right">{matic}</TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
            )}
            {ethereumTokenBalances.map((balance, i) => (
              <CryptoTableRow balance={balance} onRowValueChange={handleRowValueChange} key={i} />
            ))}
            {polygonTokenBalances.map((balance, i) => (
              <CryptoTableRow balance={balance} onRowValueChange={handleRowValueChange} key={i} />
            ))}
            {mantleTokenBalances.map((balance, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src="https://assets.coingecko.com/coins/images/30980/small/token-logo.png?1689320029" />
                      <AvatarFallback>{balance.symbol}</AvatarFallback>
                    </Avatar>
                    <p className="px-4">{balance.symbol}</p>
                  </div>
                </TableCell>
                <TableCell> Mantle </TableCell>
                <TableCell className="text-right">{balance.balance}</TableCell>
                <TableCell className="text-right"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
