// app/api/coin-chart/route.ts
import { NextResponse } from 'next/server'
import { fetchWithRetry } from '../../../../lib/fetchWithRetry'

type CacheEntry = { ts: number; data: unknown }
const CACHE_TTL = 60 * 5 * 1000 // 5 minutes
const cache = new Map<string, CacheEntry>()

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const coin = url.searchParams.get('coin') ?? 'bitcoin'
    const days = url.searchParams.get('days') ?? '30'
    const key = `chart:${coin}:${days}`

    const now = Date.now()
    const hit = cache.get(key)
    if (hit && now - hit.ts < CACHE_TTL) {
      return NextResponse.json(hit.data)
    }

    const res = await fetchWithRetry<any>(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coin)}/market_chart?vs_currency=usd&days=${encodeURIComponent(days)}`
    )

    if (!res.ok) {
      const status = res.status ?? 502
      // If 429, return a throttled status to client and avoid caching the 429 body
      if (status === 429) {
        return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
      }
      return NextResponse.json({ error: res.error ?? 'Failed to fetch coin detail', body: res.body }, { status })
    }

    cache.set(key, { ts: now, data: res.data })
    return NextResponse.json(res.data)
  } catch (err: any) {
    const msg = err?.message ?? 'Unknown error'
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch coin detail', message: msg }), { status: 502, headers: { 'Content-Type': 'application/json' } })
  }
}
