import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const coin = url.searchParams.get('coin') || 'bitcoin'
  const days = url.searchParams.get('days') || '7'
  const res = await fetchWithTimeout(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`, {}, 8000)
  const data = await res.json()
  return NextResponse.json(data)
}

async function fetchWithTimeout(url: string, opts: RequestInit = {}, timeoutMs = 8000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal })
    clearTimeout(id)
    return res
  } catch (err) {
    clearTimeout(id)
    if ((err as any)?.name === 'AbortError') throw new Error('timeout')
    throw err
  }
}