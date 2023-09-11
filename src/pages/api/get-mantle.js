export default async function handler(req, res) {
  const { wallet } = req.query;

  const resp = await fetch(`https://explorer.mantle.xyz/api?module=account&action=tokenlist&address=${wallet} `)
  const json = await resp.json()

  res.status(200).json(json)
}
