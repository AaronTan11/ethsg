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

// const defaultQuery = `
// query QB5($walletAddress: Identity!) {
//   TokenBalances(input: {filter: { owner: {_eq: $walletAddress}}, limit: 10, blockchain: ethereum}) {
//     TokenBalance {
//       amount
//       chainId
//       id
//       lastUpdatedBlock
//       lastUpdatedTimestamp
//       owner {
//         addresses
//       }
//       tokenAddress
//       tokenId
//       tokenType
//       token {
//         name
//         symbol
//       }
//     }

//   }
// }`
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
      }
    }
  }
}`;

// Initialization function, assumed to be working correctly
init("919d17d75b9f495282b64ae0d5a10ab3");

export default function Home() {
    const [currentAccount, setCurrentAccount] = useState(null);

    useEffect(() => {
        const storedAccount = localStorage.getItem("currentAccount");
        if (storedAccount) {
            setCurrentAccount(storedAccount);
            fetchQuery(defaultQuery, { walletAddress: storedAccount })
                .then((r) => {
                    // Handle the FetchQueryReturnType here
                    console.log(r);
                })
                .catch((e) => console.error("An error occurred:", e));
        }
    }, []);

    return (
        <>
            <NavBar />
            <div className="p-10">
                <div className="pb-10">
                    <Input
                        type="search"
                        placeholder="Search Crypto Addresses..."
                        className="md:w-[100%] lg:w-[100%]"
                    />
                </div>
                <div className="flex justify-between md:w-[50%] bg-slate-100 p-6 rounded-xl	">
                    <div>
                        <p> ENS: </p>
                        <br />
                        <p> Wallet Address: {currentAccount} </p>
                        <br />
                        <p> $122323424234 </p>
                        <br />
                    </div>
                    <div>
                        <Button variant="outline">Add to Portfolio</Button>
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
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p className="px-4"> Eth</p>
                                </div>
                            </TableCell>
                            <TableCell>Ethereum </TableCell>
                            <TableCell className="text-right"> 100 </TableCell>
                            <TableCell className="text-right">
                                $250.00
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
