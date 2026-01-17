'use client'
import useSWR from 'swr'
import CoinCard from './CoinCard'
import SearchBar from './SearchBar'
import { useState, useMemo } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function CoinList() {
  const [query, setQuery] = useState('')

  // Top list hook (always called)
  const { data: topList, error } = useSWR('/api/local/coins', fetcher, { refreshInterval: 60000 })

  // Search results hook — key depends on query but hook is still called unconditionally via function form
  const searchKey = query ? `/api/local/search?q=${encodeURIComponent(query)}` : null
  const { data: searchResults } = useSWR(searchKey, fetcher, { revalidateOnFocus: false })

  // Derive coins to render (memoized)
  const coins = useMemo(() => {
    if (query && searchResults?.coins) {
      return searchResults.coins.map((c: any) => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol || c.api_symbol,
        image: c.thumb || '',
        market_cap_rank: c.market_cap_rank ?? null,
        current_price: null,
        price_change_percentage_24h: null
      }))
    }
    return topList ?? []
  }, [query, searchResults, topList])

  if (error) return <div className="card">Failed to load</div>
  if (!topList) return <div className="card">Loading...</div>

  return (
    <div>
      <SearchBar onSearch={setQuery} />
      <div className="grid" style={{ marginTop: 8 }}>
        {coins.map((c: any) => <CoinCard key={c.id} coin={c} />)}
        {coins.length === 0 && <div className="card" style={{ padding: 20 }}>No results for “{query}”.</div>}
      </div>
    </div>
  )
}
