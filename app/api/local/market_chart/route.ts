import { NextResponse } from 'next/server'
import { fetchWithRetry } from '../../../../lib/fetchWithRetry'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const coin = url.searchParams.get('coin') || 'bitcoin'
    const days = url.searchParams.get('days') || '30'
    const data = await fetchWithRetry(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`, {}, 3, 8000)
    return NextResponse.json(data)
  } catch (err: any) {
    const msg = err?.message ?? 'Unknown error'
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch coin detail', message: msg }), { status: 502, headers: { 'Content-Type': 'application/json' } })
  }
}

