import PriceChart from '../../../components/PriceChart';
import { fetchCoinDetail, fetchCoinMarketChart } from '../../api/coingecko';
import CoinDetails from '../../../components/CoinDetails';

type Props = { params: { id: string } };

export default async function CoinPage({ params }: Props) {
  const id = params.id;
  const coin = await fetchCoinDetail(id);
  const chart = await fetchCoinMarketChart(id, 30);

  return (
    <div>
      <div style={{ maxWidth: 900, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={coin.image?.large || coin.image?.thumb} alt={coin.name} width={48} height={48} style={{ borderRadius: 10 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-cyan)' }}>{coin.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>{coin.symbol.toUpperCase()}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Rank #{coin.market_cap_rank ?? '—'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 900, fontSize: 18 }}>
              {coin.market_data?.current_price?.usd != null ? `$${coin.market_data.current_price.usd.toLocaleString()}` : '—'}
            </div>
            <div style={{ marginTop: 6 }} className={ (coin.market_data?.price_change_percentage_24h ?? 0) >= 0 ? 'change-pos' : 'change-neg' }>
              {coin.market_data?.price_change_percentage_24h != null ? `${coin.market_data.price_change_percentage_24h.toFixed(2)}% (24h)` : '—'}
            </div>
          </div>

          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.03)' }} />
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
  );
}
