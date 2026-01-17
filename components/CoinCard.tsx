import Link from 'next/link'

export default function CoinCard({ coin }: { coin: any }) {
  const changeClass = (coin.price_change_percentage_24h ?? 0) >= 0 ? 'change-pos' : 'change-neg'
  const image = coin?.image ?? '/placeholder-coin.png'
  return (
    <Link href={`/coins/${coin.id}`} style={{ textDecoration: 'none' }}>
      <div className="card coin-card">
        <div className="row">
          <div className="coin-meta">
            <img src={image} alt={coin.name} />
            <div>
              <div style={{ fontWeight: 700 }}>{coin.name} <small style={{ color: 'var(--muted)' }}>{(coin.symbol ?? '').toUpperCase()}</small></div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>Rank #{coin.market_cap_rank ?? '-'}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="price">{typeof coin.current_price === 'number' ? `$${coin.current_price.toLocaleString()}` : '—'}</div>
            <div className={coin.price_change_percentage_24h != null ? changeClass : ''} style={{ marginTop: 6 }}>
              {typeof coin.price_change_percentage_24h === 'number' ? `${coin.price_change_percentage_24h.toFixed(2)}%` : '—'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
