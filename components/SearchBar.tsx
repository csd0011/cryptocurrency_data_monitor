'use client'
import { useState, FormEvent } from 'react'

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState('')
  function submit(e: FormEvent) {
    e.preventDefault()
    onSearch(q.trim())
  }
  return (
    <form className="search" onSubmit={submit}>
      <input
        aria-label="Search coins"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search by name or symbol (e.g., bitcoin, eth)"
      />
      <button type="submit" className="btn">Search</button>
      <button
        type="button"
        className="btn"
        onClick={() => { setQ(''); onSearch('') }}
        style={{marginLeft:6}}
      >
        Clear
      </button>
    </form>
  )
}
