import { useState, useEffect } from 'react'
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import geckomap from "@/lib/geckomap.json"

export default function CryptoTableRow({ balance }) {
  const [rate, setRate] = useState(0)
  useEffect(() => {
    const getRate = async () => {
      // TODO: upgrade to use api key instead of public api (which is severely rate limited)
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${geckomap[balance.token.name]}`)
      const json = await res.json()
      console.log(json.market_data.current_price.usd, 'tesfdsfdssd')
      return json.market_data.current_price.usd
    }
    getRate().then((rate) => setRate(rate))
  })

  return (
    <TableRow>
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
      <TableCell className="text-right">{(rate * (balance.amount / Math.pow(10, balance.token.decimals))).toFixed(4)} USD</TableCell>
    </TableRow>

  )
}
