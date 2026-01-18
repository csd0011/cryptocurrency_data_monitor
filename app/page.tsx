import CoinList from '../components/CoinList'

export default async function Home() {
  return (
    <div>
      <h2>Top 10 Cryptocurrencies</h2>
      <CoinList />
    </div>
  )
}
