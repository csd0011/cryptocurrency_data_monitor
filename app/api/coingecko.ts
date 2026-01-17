import { fetchWithRetry } from "lib/fetchWithRetry"

export async function fetchCoinsList() {
  const res = await fetchWithRetry(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h',
    { next: { revalidate: 60 } }
  )
  if (!res.ok) throw new Error('Failed to fetch coins')
  return res.json()
}

export async function fetchCoinDetail(id: string) {
  const res = await fetchWithRetry(`https://api.coingecko.com/api/v3/coins/${id}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to fetch coin detail')
  return res.json()
}

export async function fetchCoinMarketChart(id: string, days = 30) {
  const res = await fetchWithRetry(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    { next: { revalidate: 60 } }
  )
  if (!res.ok) throw new Error('Failed to fetch market chart')
  return res.json()
}
