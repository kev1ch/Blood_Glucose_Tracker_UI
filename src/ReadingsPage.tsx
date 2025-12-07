export type Entry = { id: number; glucose: number; note: string; ts: number }

export default function ReadingsPage({ entries, onBack }: { entries: Entry[]; onBack: () => void }) {
  // sort by timestamp descending (most recent first)
  const sorted = [...entries].sort((a, b) => b.ts - a.ts)

  const formatTime = (ts: number) => new Date(ts).toLocaleString()

  return (
    <div style={{ padding: 20 }}>
      <h2>Readings</h2>
      <button onClick={onBack} style={{ marginBottom: 12 }}>Back</button>

      {sorted.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Time</th>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>Glucose (mg/dL)</th>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(e => (
              <tr key={e.id}>
                <td style={{ border: '1px solid #eee', padding: 8 }}>{formatTime(e.ts)}</td>
                <td style={{ border: '1px solid #eee', padding: 8, textAlign: 'right' }}>{e.glucose}</td>
                <td style={{ border: '1px solid #eee', padding: 8 }}>{e.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}