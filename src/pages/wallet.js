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
import { Separator } from "@/components/ui/separator";

import { init, fetchQuery } from "@airstack/airstack-react";
import dynamic from "next/dynamic";
import { BrowserProvider, formatEther } from "ethers";

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

    const getEth = async (addr) => {
        const provider = new BrowserProvider(window.ethereum);
        const wei = await provider.getBalance(addr);
        const eth = formatEther(wei);
        return eth;
    };

    useEffect(() => {
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

  const [totalSum, setTotalSum] = useState(0);

  // Define the function to handle row value change
  const handleRowValueChange = (value) => {

    // Update the state with the new total sum
    setTotalSum(value);
  };

  useEffect(() => {
    const storedAccount = localStorage.getItem("currentAccount");
    if (storedAccount) {
      setCurrentAccount(storedAccount);
      fetchQuery(defaultQuery, { walletAddress: storedAccount })
        .then((r) => {
          // Handle the FetchQueryReturnType here
          const ethereumTokenBalances = r.data.Ethereum.TokenBalance
          const polygonTokenBalances = r.data.Polygon.TokenBalance
          setEthereumTokenBalances(ethereumTokenBalances ?? [])
          setPolygonTokenBalances(polygonTokenBalances ?? [])
        })
        .catch((e) => console.error("An error occurred:", e));
      fetchQuery(ENSQuery, { walletAddress: storedAccount })
        .then((r) => {
          // Handle the FetchQueryReturnType here
          const domain = r.data.Domains.Domain
          const walletENS = domain ? domain[0].name : ''
          setWalletENS(walletENS)
        })
            fetch(`/api/get-mantle?wallet=${storedAccount}`)
                .then((r) => r.json())
                .then((r) => setMantleTokenBalances(r.result ?? []));

            getEth(storedAccount).then((eth) =>
                setEth(new Number(eth).toFixed(6))
            );
        }
    }, []);

      getEth(storedAccount).then((eth) => setEth((new Number(eth)).toFixed(6)))
    }
  }, []);

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
            <p>{totalSum.toFixed(4)} USD</p>
            <br />
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
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <p className="px-4"></p>
                </div>
              </TableCell>
              <TableCell> Ethereum </TableCell>
              <TableCell className="text-right">{eth}</TableCell>
              <TableCell className="text-right"> </TableCell>
            </TableRow>
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
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{balance.symbol}</AvatarFallback>
                    </Avatar>
                    <p className="px-4">{balance.symbol}</p>
                  </div>
                </TableCell>
                <TableCell> Mantle </TableCell>
                <TableCell className="text-right">{balance.balance}</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
