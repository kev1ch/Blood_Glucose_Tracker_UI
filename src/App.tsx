import { useState } from 'react'
import './App.css'

function App() {
  const [glucose, setGlucose] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [count, setCount] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (glucose.trim() === '') return
    const entry = { id: Date.now(), glucose: Number(glucose), note }
    console.log('Submitted entry:', entry)
    setCount(c => c + 1)
    setGlucose('')
    setNote('')
  }

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
        </div>
      </form>

      <p style={{ marginTop: 12 }}>Readings added: {count}</p>
    </div>
  )
}

export default App
