export default function CoinDetails({ coin }: { coin: any }) {
  // safe reads
  const market = coin.market_data ?? {}
  const supply = {
    circulating: market.circulating_supply ?? '—',
    total: market.total_supply ?? '—',
    max: market.max_supply ?? '—'
  }
  const change24 = market.price_change_percentage_24h ?? null
  const marketCap = market.market_cap?.usd ?? null
  const volume24 = market.total_volume?.usd ?? null
  const high24 = market.high_24h?.usd ?? null
  const low24 = market.low_24h?.usd ?? null
  const ath = market.ath?.usd ?? null
  const atl = market.atl?.usd ?? null
  const links = coin.links ?? {}

  return (
    <div className="card" style={{display:'grid', gridTemplateColumns:'1fr', gap:12}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:4}}>
        <div className="card" style={{padding:10}}>
          <div style={{fontSize:12, color:'var(--muted)'}}>Market Cap</div>
          <div style={{fontWeight:700, marginTop:6}}>{marketCap != null ? `$${Number(marketCap).toLocaleString()}` : '—'}</div>
        </div>

        <div className="card" style={{padding:10}}>
          <div style={{fontSize:12, color:'var(--muted)'}}>24h Volume</div>
          <div style={{fontWeight:700, marginTop:6}}>{volume24 != null ? `$${Number(volume24).toLocaleString()}` : '—'}</div>
        </div>

        <div className="card" style={{padding:10}}>
          <div style={{fontSize:12, color:'var(--muted)'}}>Circulating / Max</div>
          <div style={{fontWeight:700, marginTop:6}}>{supply.circulating !== '—' ? `${Number(supply.circulating).toLocaleString()} / ${supply.max !== '—' ? Number(supply.max).toLocaleString() : '—'}` : '—'}</div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12}}>
        <div style={{fontSize:12, color:'var(--muted)'}}>24h High</div>
        <div style={{fontSize:12, color:'var(--muted)'}}>24h Low</div>
        <div style={{fontSize:12, color:'var(--muted)'}}>All-time High</div>
        <div style={{fontSize:12, color:'var(--muted)'}}>All-time Low</div>

        <div style={{fontWeight:700}}>{high24 != null ? `$${high24.toLocaleString()}` : '—'}</div>
        <div style={{fontWeight:700}}>{low24 != null ? `$${low24.toLocaleString()}` : '—'}</div>
        <div style={{fontWeight:700}}>{ath != null ? `$${ath.toLocaleString()}` : '—'}</div>
        <div style={{fontWeight:700}}>{atl != null ? `$${atl.toLocaleString()}` : '—'}</div>
      </div>

      <div style={{marginTop:6, display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
        {links.homepage && links.homepage[0] && (
          <a className="btn" href={links.homepage[0]} target="_blank" rel="noreferrer">Website</a>
        )}
        {links.subreddit_url && (
          <a className="btn" href={links.subreddit_url} target="_blank" rel="noreferrer">Subreddit</a>
        )}
        {coin.hashing_algorithm && (
          <div style={{color:'var(--muted)', fontSize:13}}>Algorithm: {coin.hashing_algorithm}</div>
        )}
        <div style={{marginLeft:'auto', color:'var(--muted)', fontSize:12}}>Last updated: {new Date(coin.last_updated).toLocaleString()}</div>
      </div>

      {coin.description?.en && (
        <div style={{marginTop:8, color:'var(--muted)', fontSize:13, lineHeight:1.5, maxHeight:120, overflow:'auto'}}>
          <div style={{fontWeight:700, marginBottom:6}}>About</div>
          <div dangerouslySetInnerHTML={{ __html: coin.description.en.split('. ').slice(0,4).join('. ') + (coin.description.en.split('.').length>4 ? '...' : '') }} />
        </div>
      )}
    </div>
  )
}
