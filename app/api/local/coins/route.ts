// app/api/coins/route.ts
import { NextResponse } from 'next/server';
import { fetchWithRetry } from '../../../../lib/fetchWithRetry';

export async function GET() {
  const res = await fetchWithRetry<any>(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h'
  );

  if (!res.ok) {
    const status = res.status ?? 502;
    return NextResponse.json(
      { error: res.error ?? 'Failed to fetch coins', body: res.body },
      { status }
    );
  }

  // res.data is already parsed JSON
  return NextResponse.json(res.data);
}
