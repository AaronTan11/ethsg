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
import { ResponsiveContainer, PieChart, Pie, Legend } from "recharts";

const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 }
];

export default function Home() {
    return (
        <>
            <NavBar />
            <div>
                <Input
                    type="search"
                    placeholder="Search Crypto Addresses..."
                    className="md:w-[100px] lg:w-[300px]"
                />
            </div>
            <div> 
                <p> ENS: </p>
                <p> Wallet Address: </p>
                <p> $122323424234 </p>
                <Button variant="outline">Add to Portfolio</Button>
            </div>
            <div>
                <p> Assets </p>
                <Separator />
                <p> Chart Here </p>
            </div>
            <ResponsiveContainer>
                <PieChart>
                    <Pie dataKey="value" data={data} fill="#8884d8" label />
                </PieChart>
            </ResponsiveContainer>
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

        </>
    );
}
