import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''
  if (!q) return NextResponse.json({ coins: [] })

  const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`)
  if (!res.ok) return NextResponse.json({ coins: [] }, { status: 502 })
  const json = await res.json()
  // Return only the coins array (id, name, api_symbol, symbol, thumb, market_cap_rank)
  return NextResponse.json({ coins: json.coins ?? [] })
}
