import React, { useEffect, useState } from 'react'

export type Entry = {
  id: number
  glucose: number
  note: string
  punctureSpot: string
  ts: number
}

export default function ReadingsPage({ onBack }: { onBack: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ids currently being deleted
  const [deletingIds, setDeletingIds] = useState<number[]>([])
  // current sortBy value sent to backend (defaults to timestamp_desc)
  const [sortBy, setSortBy] = useState<string>('timestamp_desc')
  // pagination
  const [page, setPage] = useState<number>(1)
  const [size, setSize] = useState<number>(5)
  const [hasMore, setHasMore] = useState<boolean>(false)

  const fetchEntries = async (sb?: string, p?: number, s?: number) => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching entries from backend...')
      const sortParam = sb ?? sortBy
      const pageParam = p ?? page
      const sizeParam = s ?? size
      const params = new URLSearchParams()
      if (sortParam) params.set('sortBy', sortParam)
      if (pageParam) params.set('page', String(pageParam))
      if (sizeParam) params.set('size', String(sizeParam))
      const url = `http://localhost:8080/api/entries${params.toString() ? `?${params.toString()}` : ''}`
      console.log('GET', url)
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: '*/*' },
      })
      console.log(`GET /api/entries response: ${res.status} ${res.statusText}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      console.log('GET /api/entries body:', data)

      // map backend shape to local Entry type
      // expected backend items: { id?, value, timestamp, description? }
      const mapped: Entry[] = (Array.isArray(data) ? data : []).map((item: any, idx: number) => {
        const ts = item.timestamp ? Date.parse(item.timestamp) : Date.now() + idx
        return {
          id: typeof item.id === 'number' ? item.id : ts + idx,
          glucose: Number(item.value ?? item.glucose ?? 0),
          note: item.description ?? item.note ?? '',
          punctureSpot: item.punctureSpot ?? item.puncture ?? item.punctureType ?? '',
          ts,
        }
      })

      // sort by ts descending (most recent first)
      //mapped.sort((a, b) => b.ts - a.ts)
      setEntries(mapped)
      // If returned items length equals requested size, assume there may be more
      setHasMore(mapped.length >= (s ?? size))
    } catch (err: any) {
      console.error('Error fetching entries:', err)
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this reading?')) return
    setDeletingIds(prev => [...prev, id])
    console.log(`Sending DELETE /api/entries/${id}`)
    try {
      const res = await fetch(`http://localhost:8080/api/entries/${id}`, {
        method: 'DELETE',
        headers: { Accept: '*/*' },
      })
      console.log(`DELETE response: ${res.status} ${res.statusText}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // remove from state on success
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (err: any) {
      console.error('Error deleting entry:', err)
      setError(err?.message ?? String(err))
    } finally {
      setDeletingIds(prev => prev.filter(x => x !== id))
    }
  }

  useEffect(() => {
    fetchEntries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatTime = (ts: number) => new Date(ts).toLocaleString()

  return (
    <div style={{ padding: 20 }}>
      <h2>Readings</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={onBack}>Back</button>
        <button onClick={() => fetchEntries()} style={{ marginLeft: 8 }}>
          Refresh
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && entries.length === 0 && <p>No entries yet.</p>}

      {!loading && entries.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>
                Time
                <button
                  aria-label="Sort time descending"
                  onClick={() => {
                    setSortBy('timestamp_desc')
                    setPage(1)
                    fetchEntries('timestamp_desc', 1, size)
                  }}
                  style={{ marginLeft: 8, fontSize: '0.8em', padding: '2px 4px', cursor: 'pointer' }}
                >
                  ▼
                </button>
                <button
                  aria-label="Sort time ascending"
                  onClick={() => {
                    setSortBy('timestamp_asc')
                    setPage(1)
                    fetchEntries('timestamp_asc', 1, size)
                  }}
                  style={{ marginLeft: 4, fontSize: '0.8em', padding: '2px 4px', cursor: 'pointer' }}
                >
                  ▲
                </button>
              </th>

              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>
                Glucose (mg/dL)
                <button
                  aria-label="Sort glucose descending"
                  onClick={() => {
                    setSortBy('value_desc')
                    setPage(1)
                    fetchEntries('value_desc', 1, size)
                  }}
                  style={{ marginLeft: 8, fontSize: '0.8em', padding: '2px 4px', cursor: 'pointer' }}
                >
                  ▼
                </button>
                <button
                  aria-label="Sort glucose ascending"
                  onClick={() => {
                    setSortBy('value_asc')
                    setPage(1)
                    fetchEntries('value_asc', 1, size)
                  }}
                  style={{ marginLeft: 4, fontSize: '0.8em', padding: '2px 4px', cursor: 'pointer' }}
                >
                  ▲
                </button>
              </th>

              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Note</th>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Puncture Spot</th>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}> </th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id}>
                <td style={{ border: '1px solid #eee', padding: 8 }}>{formatTime(e.ts)}</td>
                <td style={{ border: '1px solid #eee', padding: 8, textAlign: 'right' }}>{e.glucose}</td>
                <td style={{ border: '1px solid #eee', padding: 8 }}>{e.note}</td>
                  <td style={{ border: '1px solid #eee', padding: 8 }}>{e.punctureSpot}</td>
                <td style={{ border: '1px solid #eee', padding: 8, textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(e.id)}
                    disabled={deletingIds.includes(e.id)}
                    aria-label={`Delete reading ${e.id}`}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'red',
                      cursor: deletingIds.includes(e.id) ? 'not-allowed' : 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    {deletingIds.includes(e.id) ? '…' : '✕'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* pagination controls */}
      {!loading && entries.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={() => {
                if (page <= 1) return
                const newPage = page - 1
                setPage(newPage)
                fetchEntries(undefined, newPage, size)
              }}
              disabled={page <= 1}
            >
              Prev
            </button>
            <div>Page {page}</div>
            <button
              onClick={() => {
                if (!hasMore) return
                const newPage = page + 1
                setPage(newPage)
                fetchEntries(undefined, newPage, size)
              }}
              disabled={!hasMore}
            >
              Next
            </button>
          </div>

          <div>
            <label>
              Page size:
              <select
                value={size}
                onChange={e => {
                  const newSize = Number(e.target.value)
                  setSize(newSize)
                  setPage(1)
                  fetchEntries(undefined, 1, newSize)
                }}
                style={{ marginLeft: 6 }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}