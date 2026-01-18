import { NextResponse } from 'next/server';
import { fetchWithRetry } from 'lib/fetchWithRetry';

type CoinInfo = {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  thumb: string;
  market_cap_rank?: number | null;
};

type SearchResponse = {
  coins?: Array<CoinInfo>;
  // other fields omitted
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';
  if (!q) return NextResponse.json({ coins: [] });

  const res = await fetchWithRetry<SearchResponse>(
    `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`
  );

  if (!res.ok) {
    return NextResponse.json({ coins: [] }, { status: 502 });
  }

  // res.data is typed as SearchResponse (not a Promise)
  const json = res.data ?? {};
  const coins: CoinInfo[] = (json.coins ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    api_symbol: c.api_symbol,
    symbol: c.symbol,
    thumb: c.thumb,
    market_cap_rank: c.market_cap_rank ?? null,
  }));

  return NextResponse.json({ coins });
}
