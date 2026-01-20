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
};

export type MarketChart = {
  prices: Array<[number, number]>;
  market_caps?: Array<[number, number]>;
  total_volumes?: Array<[number, number]>;
};

type FetchResult<T> = { ok: boolean; status?: number; data?: T; error?: string };

async function unwrap<T>(res: FetchResult<T>, ctx = 'fetch'): Promise<T> {
  if (!res.ok) {
    const msg = res.error ?? `HTTP ${res.status ?? 'error'}`;
    throw new Error(`${ctx} failed: ${msg}`);
  }
  return res.data as T;
}

async function fetchJson<T>(url: string, timeoutMs = 0): Promise<FetchResult<T>> {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const signal = controller?.signal;

  let timeoutId: number | undefined;
  if (controller && timeoutMs > 0) {
    timeoutId = (setTimeout(() => controller.abort(), timeoutMs) as unknown) as number;
  }

  try {
    const resp = await fetch(url, { signal });
    if (timeoutId !== undefined) clearTimeout(timeoutId);

    const status = resp.status;
    if (!resp.ok) {
      // try parse error body if JSON
      let errText: string | undefined;
      try {
        const b = await resp.text();
        errText = b ? b : undefined;
      } catch { /* ignore */ }
      return { ok: false, status, error: errText ?? resp.statusText };
    }

    const data = (await resp.json()) as T;
    return { ok: true, status, data };
  } catch (err: any) {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    const isAbort = err?.name === 'AbortError';
    return { ok: false, error: isAbort ? 'timeout' : (err?.message ?? String(err)) };
  }
}

export async function fetchCoinDetail(id: string, timeoutMs = 0): Promise<CoinDetail> {
  const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}`;
  const res = await fetchJson<CoinDetail>(url, timeoutMs);
  return unwrap(res, 'fetchCoinDetail');
}

export async function fetchCoinMarketChart(id: string, days = 7, timeoutMs = 0): Promise<MarketChart> {
  const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${encodeURIComponent(String(days))}`;
  const res = await fetchJson<MarketChart>(url, timeoutMs);
  return unwrap(res, 'fetchCoinMarketChart');
}
