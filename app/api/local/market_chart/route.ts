import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const coin = url.searchParams.get('coin') || 'bitcoin'
  const days = url.searchParams.get('days') || '7'
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coin)}/market_chart?vs_currency=usd&days=${encodeURIComponent(days)}`, {}, 8000)
  const data = await res.json()
  return NextResponse.json(data)
}
