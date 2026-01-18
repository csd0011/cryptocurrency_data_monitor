'use client'
import useSWR from 'swr'
import CoinCard from './CoinCard'
import SearchBar from './SearchBar'
import { useState, useMemo } from 'react'

type Coin = {
  id: string
  name?: string
  symbol?: string
  api_symbol?: string
  image?: string
  market_cap_rank?: number | null
  current_price?: number | null
  price_change_percentage_24h?: number | null
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function CoinList() {
  const [query, setQuery] = useState('')

  const { data: topList, error } = useSWR('/api/local/coins', fetcher, { refreshInterval: 60000 })

  const searchKey = query ? `/api/local/search?q=${encodeURIComponent(query)}` : null
  const { data: searchResults } = useSWR(searchKey, fetcher, { revalidateOnFocus: false })

  const coins: Coin[] = useMemo(() => {
    const normalize = (c: any): Coin | null => {
      if (!c) return null
      const id = String(c.id ?? c.symbol ?? '')
      if (!id) return null
      const image =
        c.image ??
        c.thumb ??
        (c.image && typeof c.image === 'object' ? c.image.small ?? c.image.thumb ?? c.image.large : '') ??
        ''
      return {
        id,
        name: c.name,
        symbol: c.symbol ?? c.api_symbol,
        api_symbol: c.api_symbol,
        image,
        market_cap_rank: c.market_cap_rank ?? null,
        current_price: c.current_price ?? null,
        price_change_percentage_24h: c.price_change_percentage_24h ?? null,
      }
    }

    // If user is searching, prefer searchResults
    if (query) {
      if (!searchResults) return []
      const s = Array.isArray(searchResults.coins) ? searchResults.coins : Array.isArray(searchResults) ? searchResults : []
      return s.map(normalize).filter(Boolean) as Coin[]
    }

    // No query: use topList (handle both array and { coins: [] } shapes)
    const list = Array.isArray(topList)
      ? topList
      : (topList && Array.isArray((topList as any).coins) ? (topList as any).coins : [])
    return list.map(normalize).filter(Boolean) as Coin[]
  }, [query, searchResults, topList])

  if (error) return <div className="card">Failed to load</div>
  if (!query && !topList) return <div className="card">Loading...</div>

  return (
    <div>
      <SearchBar onSearch={setQuery} />
      <div className="grid" style={{ marginTop: 8 }}>
        {coins.length > 0 ? coins.map((c: any) => <CoinCard key={c.id} coin={c} />)
          : <div className="card" style={{ padding: 20 }}>No results for “{query}”.</div>}
      </div>
    </div>
  )
}
