import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header } from '../components/ui.jsx'
import { REQUIRED_MUSCLES, WORKOUT_PLAN } from '../data/workoutPlan.js'
import { WEEK_DAYS } from '../data/splits.js'

const GROUPS = [...new Set(WORKOUT_PLAN.map((x) => x.group))]

export default function CustomSplit() {
  const nav = useNavigate()
  const { createCustomSplit } = useStore()
  const [name, setName] = useState('My Custom Split')
  const [dayNames, setDayNames] = useState({ Monday: 'Chest + Triceps', Tuesday: 'Back + Biceps', Wednesday: 'Rest', Thursday: 'Shoulders', Friday: 'Legs', Saturday: 'Core + Cardio', Sunday: 'Rest' })
  const [restDays, setRestDays] = useState(['Wednesday', 'Sunday'])
  const [picked, setPicked] = useState({ Monday: ['Pectoralis major', 'Triceps brachii'], Tuesday: ['Latissimus dorsi', 'Biceps brachii'], Thursday: ['Anterior deltoid'], Friday: ['Quadriceps'], Saturday: ['Rectus abdominis'] })
  const [group, setGroup] = useState(GROUPS[0])
  const [msg, setMsg] = useState('')

  function toggleRest(d) {
    setRestDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  }
  function toggleMuscle(day, m) {
    setPicked((prev) => {
      const cur = prev[day] || []
      return { ...prev, [day]: cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m] }
    })
  }

  async function save() {
    const days = WEEK_DAYS.map((d) => {
      if (restDays.includes(d)) return { dayOfWeek: d, name: 'Rest', isRestDay: true, muscles: [] }
      const ms = (picked[d] || []).map((muscle, i) => ({ muscle, priority: i + 1 }))
      if (!ms.length) return { dayOfWeek: d, name: 'Rest', isRestDay: true, muscles: [] }
      return { dayOfWeek: d, name: dayNames[d] || 'Training', isRestDay: false, muscles: ms }
    })
    if (!days.some((d) => !d.isRestDay)) { setMsg('⚠ Add muscles to at least one training day.'); return }
    setMsg('LOADING...')
    const id = await createCustomSplit({ name: name.trim() || 'My Custom Split', days })
    setMsg('✓ Custom split saved.')
    setTimeout(() => nav(`/splits/${id}`), 600)
  }

  const groupMuscles = REQUIRED_MUSCLES.filter((m) => WORKOUT_PLAN.find((x) => x.muscle === m)?.group === group)

  return (
    <div className="no-hscroll">
      <Header title="CREATE CUSTOM SPLIT" sub="Your template — presets stay untouched" />
      <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
        <label className="block"><span className="mono text-[10px] text-mut">SPLIT NAME</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Custom Split" /></label>

        {WEEK_DAYS.map((d) => {
          const isRest = restDays.includes(d)
          return (
            <div key={d} className="card p-3">
              <div className="flex items-center gap-2">
                <b className="text-sm">{d.toUpperCase()}</b>
                <button className="btn ml-auto" style={{ width: 'auto', minHeight: 44 }} onClick={() => toggleRest(d)} aria-pressed={isRest}>
                  {isRest ? 'SET TRAINING' : 'SET REST'}
                </button>
              </div>
              {!isRest && (
                <>
                  <input value={dayNames[d]} onChange={(e) => setDayNames({ ...dayNames, [d]: e.target.value })} aria-label={`${d} focus`} className="mt-2" />
                  <div className="mono text-[10px] text-mut mt-2">MUSCLES: {(picked[d] || []).join(', ') || '—'}</div>
                </>
              )}
            </div>
          )
        })}

        <div className="card p-3">
          <div className="mono text-[11px] text-mut mb-2">ADD MUSCLES PER DAY</div>
          <label className="block mb-2"><span className="mono text-[10px] text-mut">MUSCLE GROUP</span>
            <select value={group} onChange={(e) => setGroup(e.target.value)}>{GROUPS.map((g) => <option key={g}>{g}</option>)}</select></label>
          {WEEK_DAYS.filter((d) => !restDays.includes(d)).map((d) => (
            <div key={d} className="mb-2">
              <div className="mono text-[10px] text-mut">{d.toUpperCase()}</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {groupMuscles.map((m) => {
                  const on = (picked[d] || []).includes(m)
                  return (
                    <button key={m} onClick={() => toggleMuscle(d, m)} className="mono text-[11px] px-2 py-1.5" style={{ border: '1px solid #2a2e34', background: on ? '#22c55e' : 'transparent', color: on ? '#04120a' : '#e8eaed', minHeight: 44 }} aria-pressed={on}>
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ minHeight: 52 }} onClick={save}>SAVE MY CUSTOM SPLIT</button>
        {msg && <div className="mono text-xs" role="status">{msg}</div>}
        <Link to="/splits" className="btn text-center">BACK TO LIBRARY</Link>
      </div>
    </div>
  )
}
