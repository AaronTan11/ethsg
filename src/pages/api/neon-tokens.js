import { JsonRpcProvider, Contract } from "ethers"
import abi from "@/lib/neonErc20Factory.json"

// const lookup = [
//   "0x202C35e517Fa803B537565c40F0a6965D7204609",
//   "0x5f38248f339Bf4e84A2caf4e4c0552862dC9F82a",
//   "0xEA6B04272f9f62F997F666F07D3a974134f7FFb9",
//   "0x5f0155d08eF4aaE2B500AefB64A3419dA8bB611a",
//   "0x54EcEC9D995A6CbFF3838F6a8F38099E518805d7",
//   "0xcFFd84d468220c11be64dc9dF64eaFE02AF60e8A",
// ]

export default async function handler(req, res) {
  getNeonTokens()
  res.status(200).json({ message: "OK", body: {} })
}

const getNeonTokens = () => {
  const providerUrl = 'https://eth-mainnet.g.alchemy.com/v2/lG35OlVCEHPOe_3aSVvMQ4KGN1T66Dff'
  // const providerUrl = 'https://neon-proxy-mainnet.solana.p2p.org'
  const provider = new JsonRpcProvider(providerUrl)
  console.log(JSON.stringify(provider, null, 2))
  return true
}
