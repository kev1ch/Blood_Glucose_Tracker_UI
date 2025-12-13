import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import ReadingsPage from './ReadingsPage'
import type { Entry } from './ReadingsPage'

function Home({
  entries,
  setEntries,
  setCount,
}: {
  entries: Entry[]
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>
  setCount: React.Dispatch<React.SetStateAction<number>>
}) {
  const [glucose, setGlucose] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [punctureSpot, setPunctureSpot] = useState<string>('')
  const [dateTime, setDateTime] = useState<string>('')
  const navigate = useNavigate()

  // build puncture options: Hand (L/R) x Finger (1-5) x Side (L/C/R)
  const punctureOptions: string[] = []
  ;['L', 'R'].forEach(h => {
    [1, 2, 3, 4, 5].forEach(f => {
      ['L', 'C', 'R'].forEach(s => punctureOptions.push(`${h}${f}${s}`))
    })
  })

  const handleSubmit = (e: React.FormEvent) => {
    alert('Debug: handleSubmit called')
    console.log('Submitting new glucose entry')
    e.preventDefault()
    if (glucose.trim() === '') return

    let ts = Date.now()
    if (dateTime.trim() !== '') {
      const parsed = new Date(dateTime).getTime()
      if (!isNaN(parsed)) ts = parsed
    }

    const entry: Entry = { id: Date.now(), glucose: Number(glucose), note, punctureSpot, ts }

    const payload: any = {
      value: Number(glucose),
      timestamp: new Date(ts).toISOString(),
      description: note,
    }
    if (punctureSpot.trim() !== '') payload.punctureSpot = punctureSpot
    console.log('Sending POST request with payload:', payload)

    // POST to backend
    fetch('http://localhost:8080/api/entries', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        console.log('Backend response:', data)
        setEntries(prev => [entry, ...prev])
        setCount(c => c + 1)
        setGlucose('')
        setNote('')
        setDateTime('')
        setPunctureSpot('')
      })
      .catch(err => console.error('Error posting entry:', err))
  }

  return (
    <div style={{ padding: 20 }}>
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

        <div style={{ marginTop: 8 }}>
          <label>
            Puncture (optional):
            <select value={punctureSpot} onChange={e => setPunctureSpot(e.target.value)} style={{ marginLeft: 8 }}>
              <option value="">--</option>
              {punctureOptions.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginTop: 8 }}>
          <label>
            Date & Time (optional):
            <input
              type="datetime-local"
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit">Add Reading</button>
          <button type="button" onClick={() => navigate('/readings')} style={{ marginLeft: 8 }}>
            Show Readings
          </button>
        </div>
      </form>
    </div>
  )
}

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home entries={entries} setEntries={setEntries} setCount={setCount} />} />
        <Route path="/readings" element={<ReadingsPage onBack={() => window.history.back()} />} />
      </Routes>

      {/* a simple footer showing total added */}
      <div style={{ position: 'fixed', bottom: 12, right: 12, fontSize: 12 }}>
        Readings added: {count}
      </div>
    </BrowserRouter>
  )
}
