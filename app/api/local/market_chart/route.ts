// app/api/coin-chart/route.ts
import { NextResponse } from 'next/server';
import { fetchWithRetry } from '../../../../lib/fetchWithRetry';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const coin = url.searchParams.get('coin') ?? 'bitcoin';
    const days = url.searchParams.get('days') ?? '30';

    const res = await fetchWithRetry<any>(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
        coin
      )}/market_chart?vs_currency=usd&days=${encodeURIComponent(days)}`
    );

    if (!res.ok) {
      const status = res.status ?? 502;
      return NextResponse.json(
        { error: res.error ?? 'Failed to fetch coin detail', body: res.body },
        { status }
      );
    }

    // Now TypeScript knows res is the ok branch and has .data
    return NextResponse.json(res.data);
  } catch (err: any) {
    const msg = err?.message ?? 'Unknown error';
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch coin detail', message: msg }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
