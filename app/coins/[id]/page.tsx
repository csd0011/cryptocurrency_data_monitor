import PriceChart from '../../../components/PriceChart'
import CoinDetails from '../../../components/CoinDetails'
import { fetchWithRetry } from '../../../lib/fetchWithRetry'

type Props = { params: { id: string } }

export default async function CoinPage({ params }: Props) {
  const id = params.id
  let coin = null
  let chart = { prices: [] }

  try {
    coin = await fetchWithRetry(`https://api.coingecko.com/api/v3/coins/${id}`, {}, 3, 8000)
  } catch (e) {
    // keep coin null to render fallback UI
  }

  try {
    chart = await fetchWithRetry(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`, {}, 3, 8000)
  } catch (e) {
    chart = { prices: [] }
  }

  return (
    <div>
      {/* simplified: handle nulls safely */}
      <div style={{ maxWidth: 900, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={coin?.image?.large || '/placeholder.png'} alt={coin?.name || 'Coin'} width={48} height={48} style={{ borderRadius: 10 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-cyan)' }}>{coin?.name ?? 'Unknown'}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>{coin?.symbol?.toUpperCase() ?? '--'}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Rank #{coin?.market_cap_rank ?? '—'}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: 16 }}>
        <div style={{ width: '100%' }}>
          <PriceChart initialData={chart.prices} coinId={id} />
        </div>
        <div style={{ width: '100%' }}>
          <CoinDetails coin={coin} />
        </div>
      </div>
    </div>
  )
}
