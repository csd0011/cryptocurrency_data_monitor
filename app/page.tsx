import CoinList from '../components/CoinList'

export default async function Home() {
  return (
    <div>
      <h2>Top 3 Cryptocurrencies</h2>
      <CoinList />
    </div>
  )
}
