import Link from 'next/link'

export default function CoinCard({ coin }: { coin: any }) {
  const changeClass = (coin.price_change_percentage_24h ?? 0) >= 0 ? 'change-pos' : 'change-neg'
  return (
    <Link href={`/coins/${coin.id}`} style={{textDecoration:'none'}}>
      <div className="card coin-card">
        <div className="row">
          <div className="coin-meta">
            <img src={coin.image || '/placeholder-coin.png'} alt={coin.name} />
            <div>
              <div style={{fontWeight:700}}>{coin.name} <small style={{color:'var(--muted)'}}>{(coin.symbol ?? '').toUpperCase()}</small></div>
              <div style={{color:'var(--muted)', fontSize:12}}>Rank #{coin.market_cap_rank ?? '-'}</div>
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="price">{coin.current_price != null ? `$${coin.current_price.toLocaleString()}` : '—'}</div>
            <div className={coin.price_change_percentage_24h != null ? changeClass : ''} style={{marginTop:6}}>
              {coin.price_change_percentage_24h != null ? `${coin.price_change_percentage_24h.toFixed(2)}%` : '—'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
