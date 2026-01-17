import '../styles/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Crypto Monitor',
  description: 'View crypto prices and charts'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, padding:'20px 28px', borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
          <div style={{display:'flex', alignItems:'center', gap:14}}>
            <div style={{
              width:52, height:52, borderRadius:12,
              background: 'linear-gradient(135deg, rgba(0,229,255,0.98), rgba(255,47,255,0.92))',
              boxShadow:'0 10px 30px rgba(0,229,255,0.08), 0 2px 6px rgba(255,47,255,0.04)',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#041017', fontWeight:900, fontFamily:'var(--mono)', fontSize:18
            }}>
              CM
            </div>

            <div style={{display:'flex', flexDirection:'column', lineHeight:1}}>
              <div style={{display:'flex', alignItems:'baseline', gap:8}}>
                <h1 style={{margin:0, fontSize:18, letterSpacing:0.8, color:'var(--accent-cyan)'}}>Crypto Monitor</h1>
              </div>
              <div style={{fontSize:12, color:'rgba(207,239,255,0.7)', marginTop:4, maxWidth:560}}>
                Track Crypto Market
              </div>
            </div>
          </div>

          <nav style={{display:'flex', gap:10, alignItems:'center'}}>
            <a href="/" style={{color:'var(--muted)', textDecoration:'none', fontSize:13}}>Overview</a>
            <a href="/coins/bitcoin" style={{color:'var(--muted)', textDecoration:'none', fontSize:13}}>Bitcoin</a>
            <a href="/coins/ethereum" style={{color:'var(--muted)', textDecoration:'none', fontSize:13}}>Ethereum</a>
            <div style={{width:1, height:24, background:'rgba(255,255,255,0.03)'}} />
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  )
}
