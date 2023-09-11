import { useState, useEffect } from "react";
import Image from "next/image";
import NavBar from "@/components/navBar";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
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
import { ResponsiveContainer, PieChart, Pie, Legend, Cell } from "recharts";
import { init, fetchQuery } from "@airstack/airstack-react";
import dynamic from "next/dynamic";

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
  const [searchInput, setSearchInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState('');
  const [walletENS, setWalletENS] = useState(null);
  const [ethereumTokenBalances, setEthereumTokenBalances] = useState([]);
  const [polygonTokenBalances, setPolygonTokenBalances] = useState([])
  const [mantleTokenBalances, setMantleTokenBalances] = useState([])

  useEffect(() => {
    const storedAccount = localStorage.getItem("currentAccount");
    setCurrentAccount(storedAccount)
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
        //gpt
        console.log("ENS Response:", r); // Log the response for debugging
        // Check if the expected data exists
        const domains = r.data?.Domains?.Domain || [];
        if (domains.length > 0) {
          const walletENS = domains[0].name;
          console.log("Wallet ENS:", walletENS); // Log the ENS value
          setWalletENS(walletENS);
        } else {
          // Handle the case where no ENS name is found
          console.log("No ENS name found for this wallet address.");
          setWalletENS(null); // or setWalletENS("") or any default value you prefer
        }
      })
      .catch((e) => console.error("An error occurred:", e));

    fetch(`/api/get-mantle?wallet=${storedAccount}`)
      .then((r) => r.json())
      .then((r) => setMantleTokenBalances(r.result ?? []))
  }, [])

  const handleInput = (e) => {
    setSearchInput(e.target.value);
    fetchQuery(defaultQuery, { walletAddress: searchInput })
      .then((r) => {
        // Handle the FetchQueryReturnType here
        const ethereumTokenBalances = r.data.Ethereum.TokenBalance
        const polygonTokenBalances = r.data.Polygon.TokenBalance
        setEthereumTokenBalances(ethereumTokenBalances ?? [])
        setPolygonTokenBalances(polygonTokenBalances ?? [])
      })
      .catch((e) => console.error("An error occurred:", e));
    fetchQuery(ENSQuery, { walletAddress: searchInput })
      .then((r) => {
        //gpt
        console.log("ENS Response:", r); // Log the response for debugging
        // Check if the expected data exists
        const domains = r.data?.Domains?.Domain || [];
        if (domains.length > 0) {
          const walletENS = domains[0].name;
          console.log("Wallet ENS:", walletENS); // Log the ENS value
          setWalletENS(walletENS);
        } else {
          // Handle the case where no ENS name is found
          console.log("No ENS name found for this wallet address.");
          setWalletENS(null); // or setWalletENS("") or any default value you prefer
        }
      })
      .catch((e) => console.error("An error occurred:", e));

    fetch(`/api/get-mantle?wallet=${searchInput}`)
      .then((r) => r.json())
      .then((r) => setMantleTokenBalances(r.result ?? []))
  };

  return (
    <>
      <NavBar />
      <div className="p-10">
        <div className="pb-10">
          <Input
            type="search"
            placeholder="Search Crypto Addresses..."
            className="md:w-[100%] lg:w-[100%]"
            value={searchInput}
            onChange={handleInput}
            onKeyPress={handleInput}
          />
        </div>
        <div className="flex justify-between md:w-[50%] bg-slate-100 p-6 rounded-xl	">
          <div>
            <p> ENS: {walletENS || "N/A"} </p>
            <br />
            <p> Wallet Address: {searchInput || currentAccount} </p>
            <br />
            <p> $122323424234 </p>
            <br />
          </div>
          <div>
            <Button variant="outline" className="text-black text-center border-b-2 hover:bg-slate-950 md:hover:text-white rounded-lg">
              Add to Portfolio
            </Button>
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
            {ethereumTokenBalances.map((balance, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{balance.token.symbol}</AvatarFallback>
                    </Avatar>
                    <p className="px-4">{balance.token.symbol}</p>
                  </div>
                </TableCell>
                <TableCell> Ethereum </TableCell>
                <TableCell className="text-right">{(balance.amount / Math.pow(10, balance.token.decimals)).toFixed(2)}</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            ))}
            {polygonTokenBalances.map((balance, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{balance.token.symbol}</AvatarFallback>
                    </Avatar>
                    <p className="px-4">{balance.token.symbol}</p>
                  </div>
                </TableCell>
                <TableCell> Polygon </TableCell>
                <TableCell className="text-right">{(balance.amount / Math.pow(10, balance.token.decimals)).toFixed(2)}</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
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

