// lib/coingecko.ts
import { fetchWithRetry, FetchResult } from '../../lib/fetchWithRetry';

export type CoinDetail = {
  id: string;
  name: string;
  symbol: string;
  image?: { thumb?: string; small?: string; large?: string };
  market_cap_rank?: number | null;
  market_data?: {
    current_price?: { usd?: number | null };
    price_change_percentage_24h?: number | null;
  };
  // add other fields as needed
};

export type MarketChart = {
  prices: Array<[number, number]>;
  market_caps?: Array<[number, number]>;
  total_volumes?: Array<[number, number]>;
};

async function unwrap<T>(res: FetchResult<T>, ctx = 'fetch') : Promise<T> {
  if (!res.ok) {
    const msg = res.error ?? `HTTP ${res.status ?? 'error'}`;
    throw new Error(`${ctx} failed: ${msg}`);
  }
  return res.data;
}

export async function fetchCoinDetail(id: string): Promise<CoinDetail> {
  const res = await fetchWithRetry<CoinDetail>(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}`);
  return unwrap(res, 'fetchCoinDetail');
}

export async function fetchCoinMarketChart(id: string, days = 30): Promise<MarketChart> {
  const res = await fetchWithRetry<MarketChart>(
    `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${encodeURIComponent(String(days))}`
  );
  return unwrap(res, 'fetchCoinMarketChart');
}
