import PriceChart from '../../../components/PriceChart'
import { fetchCoinDetail, fetchCoinMarketChart } from '../../api/coingecko'
import CoinDetails from '../../../components/CoinDetails'

type Props = { params: { id: string } }

export default async function CoinPage({ params }: Props) {
  const id = params.id

  // fetch full coin detail and market chart (safe-guard responses)
  const coin = await fetchCoinDetail(id)
  const rawChart = await fetchCoinMarketChart(id, 30)
  const prices = Array.isArray(rawChart?.prices) ? rawChart.prices : []

  return (
    <div>
      {/* Title row: image + name/symbol left, stats/actions right — aligned with chart/details width */}
      <div style={{ maxWidth: 900, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={coin.image?.large || coin.image?.thumb || '/placeholder-coin.png'}
            alt={coin.name}
            width={48}
            height={48}
            style={{ borderRadius: 10, background: 'rgba(255,255,255,0.02)', padding: 6 }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-cyan)' }}>{coin.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>{(coin.symbol ?? '').toUpperCase()}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Rank #{coin.market_cap_rank ?? '—'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 900, fontSize: 18 }}>
              {coin.market_data?.current_price?.usd != null ? `$${coin.market_data.current_price.usd.toLocaleString()}` : '—'}
            </div>
            <div
              style={{ marginTop: 6 }}
              className={(coin.market_data?.price_change_percentage_24h ?? 0) >= 0 ? 'change-pos' : 'change-neg'}
            >
              {coin.market_data?.price_change_percentage_24h != null ? `${coin.market_data.price_change_percentage_24h.toFixed(2)}% (24h)` : '—'}
            </div>
          </div>

          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.03)' }} />

          <div style={{ display: 'flex', gap: 8 }}>
            <a className="btn" href={coin.links?.homepage?.[0] || '#'} target="_blank" rel="noreferrer">Website</a>
            <a className="btn" href={coin.links?.subreddit_url || '#'} target="_blank" rel="noreferrer">Community</a>
          </div>
        </div>
      </div>

      {/* Shared-width container so chart and details match exactly */}
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: 16 }}>
        <div style={{ width: '100%' }}>
          <PriceChart initialData={prices} coinId={id} />
        </div>

        <div style={{ width: '100%' }}>
          <CoinDetails coin={coin} />
        </div>
      </div>
    </div>
  )
}
