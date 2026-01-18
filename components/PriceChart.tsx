'use client'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale
} from 'chart.js'
import 'chartjs-adapter-date-fns'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, TimeScale)

type MarketChart = { prices: Array<[number, number]> }

export default function PriceChart({ initialData, coinId }: { initialData: any, coinId: string }) {
  const safeInitial = Array.isArray(initialData) ? initialData : []
  const [days, setDays] = useState(7)
  const [data, setData] = useState<number[][]>(safeInitial)

  async function changeRange(d: number) {
    setDays(d)
    try {
      const res = await fetch(`/api/local/market_chart?coin=${encodeURIComponent(coinId)}&days=${d}`)
      const json = await res.json()
      if (!res.ok) {
        setData([])
        return
      }

      setData(Array.isArray(json?.prices) ? json.prices : [])
    } catch {
      setData([])
    }
  }

  const labels = data.map(p => (Array.isArray(p) ? p[0] : null)).filter(Boolean) as number[]
  const values = data.map(p => (Array.isArray(p) ? p[1] : null)).filter(v => v !== null) as number[]

  const chartData = {
    labels,
    datasets: [{
      label: 'Price (USD)',
      data: values,
      borderColor: 'rgba(0,229,255,0.92)',
      backgroundColor: 'rgba(0,229,255,0.08)',
      tension: 0.18,
      pointRadius: 0,
      fill: true
    }]
  }

  const opts = {
    scales: {
      x: { type: 'time', grid: { color: 'rgba(255,255,255,0.02)' }, ticks: { color: 'rgba(255,255,255,0.65)' } },
      y: { grid: { color: 'rgba(255,255,255,0.02)' }, ticks: { color: 'rgba(255,255,255,0.65)' } }
    },
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    maintainAspectRatio: false
  }

  return (
    <div className="card chart-wrap">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
        <div>
          <button className="btn" onClick={() => changeRange(7)} disabled={days===7}>7d</button>
          <button className="btn" onClick={() => changeRange(30)} disabled={days===30}>30d</button>
          <button className="btn" onClick={() => changeRange(90)} disabled={days===90}>90d</button>
        </div>
        <div style={{color:'var(--muted)', fontSize:13}}>Source: CoinGecko</div>
      </div>
      <div style={{height:320}}>
        <Line data={chartData as any} options={opts as any} />
      </div>
    </div>
  )
}
