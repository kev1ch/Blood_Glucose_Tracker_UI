import { useState } from 'react'
import './App.css'

function App() {
  const [glucose, setGlucose] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [count, setCount] = useState(0)

  const [entries, setEntries] = useState<{ id: number; glucose: number; note: string; ts: number }[]>([])
  const [showTable, setShowTable] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (glucose.trim() === '') return
    const entry = { id: Date.now(), glucose: Number(glucose), note, ts: Date.now() }
    console.log('Submitted entry:', entry)

    setEntries(prev => [entry, ...prev])
    setCount(c => c + 1)
    setGlucose('')
    setNote('')
  }

  const toggleTable = () => setShowTable(s => !s)

  const formatTime = (ts: number) => new Date(ts).toLocaleString()

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Blood Glucose Tracker</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Glucose (mg/dL):
            <input
              type="number"
              value={glucose}
              onChange={e => setGlucose(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        <div style={{ marginTop: 8 }}>
          <label>
            Note:
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. before breakfast"
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit">Add Reading</button>
          <button type="button" onClick={toggleTable} style={{ marginLeft: 8 }}>
            {showTable ? 'Hide Readings' : 'Show Readings'}
          </button>
        </div>
      </form>

      <p style={{ marginTop: 12 }}>Readings added: {count}</p>

      {showTable && (
        <div style={{ marginTop: 16 }}>
          {entries.length === 0 ? (
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
                {entries.map(e => (
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
      )}
    </div>
  )
}

export default App
