import { useState, useEffect } from "react";
import Image from "next/image";
import NavBar from '@/components/navBar'
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
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ResponsiveContainer, PieChart, Pie, Legend, Cell } from "recharts";
import { init, fetchQuery } from "@airstack/airstack-react";

//dummy shxt data
const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

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
const defaultQuery = `query MyQuery(myAddress: Identity!) {
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
}`






// hardcode atm for testing. airstack provider doesn't seem to work in _app.js
init("919d17d75b9f495282b64ae0d5a10ab3")

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    // Retrieve from localStorage on component mount
    const storedAccount = localStorage.getItem("currentAccount");
    if (storedAccount) {
      setCurrentAccount(storedAccount);
      fetchQuery(defaultQuery, { walletAddress: storedAccount })
        // .then(r => r.json())
        .then(r => console.log(r))
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
          <PieChart width={1000} height={250}>
            <Pie
              data={data}
              cx={250}
              cy={100}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
