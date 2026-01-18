import { fetchWithRetry } from 'lib/fetchWithRetry'
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetchWithRetry('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=2&page=1&price_change_percentage=24h', {}, 3, 8000)
  const data = await res.json()
  return NextResponse.json(data)
}
