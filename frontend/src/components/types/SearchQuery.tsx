/**
 * This component is used to ask a free text question to the model.
 *
 * @component SearchQuery
 * @author Beatriz Sanssi
 */

import { useState } from 'react'
import { apiFetch } from '../../utils/apiFetch'

interface EmbeddingMatch {
  id: string
  metadata: {
    text: string
  }
}

/**
 * This component allows users to ask a free text question to the model.
 *
 * @returns {JSX.Element} The SearchQuery component.
 */
export default function SearchQuery() {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<EmbeddingMatch[]>([])

  const searchFreeQuery = async () => {
    const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/embeddings/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    const data = await res.json()
    setResults(data)
  }

  return (
    <div>
      <h2>Ask a Question</h2>
      <input
        type="text"
        placeholder="e.g. which chocolate is dairy free?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchFreeQuery}>Ask</button>

      <ul>
        {results.map((match) => (
          <li key={match.id}>{match.metadata?.text}</li>
        ))}
      </ul>
    </div>
  )
}