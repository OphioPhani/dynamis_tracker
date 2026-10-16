import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header, EmptyState } from '../components/ui.jsx'
import { SPLIT_TEMPLATES, splitMuscleUnion } from '../data/splits.js'

const CATS = ['All', 'Beginner', 'Hypertrophy', 'Advanced', 'Custom']
const DAY_OPTS = ['All', '3', '4', '5', '6']
const GOAL_OPTS = ['All', 'Hypertrophy', 'Strength', 'Bodybuilding', 'Full body']

export default function Splits() {
  const { activeSplitId, customSplits } = useStore()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [days, setDays] = useState('All')
  const [goal, setGoal] = useState('All')

  const all = useMemo(() => [...customSplits, ...SPLIT_TEMPLATES], [customSplits])

  const rows = all.filter((s) => {
    if (cat !== 'All' && s.category !== cat) return false
    if (days !== 'All' && String(s.daysPerWeek) !== days) return false
    if (goal !== 'All' && !(s.goals || []).includes(goal)) return false
    if (q.trim()) {
      const hay = `${s.name} ${s.description} ${(s.tags || []).join(' ')}`.toLowerCase()
      if (!q.toLowerCase().split(/\s+/).every((t) => hay.includes(t))) return false
    }
    return true
  })

  return (
    <div className="no-hscroll">
      <Header title="WORKOUT SPLITS" sub="WORKOUT SPLIT LIBRARY — Choose a training split and start training immediately." />
      <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
        <label className="search-field">
          <span className="search-icon" aria-hidden="true"><Search size={16} /></span>
          <input className="search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search splits..." aria-label="Search splits" />
        </label>
        <div className="grid grid-cols-3 gap-2">
          <label className="block"><span className="mono text-[10px] text-mut">CATEGORY</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="block"><span className="mono text-[10px] text-mut">DAYS/WK</span>
            <select value={days} onChange={(e) => setDays(e.target.value)}>{DAY_OPTS.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="block"><span className="mono text-[10px] text-mut">GOAL</span>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>{GOAL_OPTS.map((c) => <option key={c}>{c}</option>)}</select></label>
        </div>

        <Link to="/splits/new" className="btn flex items-center justify-center gap-2"><Plus size={16} /> CREATE CUSTOM SPLIT</Link>

        <div className="mono text-[11px] text-mut">{rows.length} SPLITS</div>
        <div className="space-y-2">
          {rows.map((s) => {
            const union = splitMuscleUnion(s)
            const isActive = s.id === activeSplitId
            return (
              <article key={s.id} className="card p-3" style={isActive ? { borderColor: '#22c55e' } : undefined}>
                <div className="flex items-center gap-2">
                  <b className="text-sm">{s.name.toUpperCase()}</b>
                  {s.badge && <span className="badge" style={{ background: '#fff', color: '#000' }}>{s.badge}</span>}
                  {!s.isPreset && <span className="badge badge-best">CUSTOM</span>}
                  {isActive && <span className="badge badge-good ml-auto">ACTIVE</span>}
                </div>
                <div className="mono text-[11px] text-mut mt-1">{s.daysPerWeek} DAYS / WEEK · {s.category.toUpperCase()} · {s.level.toUpperCase()}</div>
                <div className="text-xs mt-1 text-mut">{s.description}</div>
                <div className="mono text-[11px] mt-1">{union.length} MUSCLES</div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link to={`/splits/${s.id}`} className="btn text-center">DETAILS</Link>
                  <Link to={`/splits/${s.id}`} className="btn btn-primary text-center">USE THIS SPLIT</Link>
                </div>
              </article>
            )
          })}
          {!rows.length && <EmptyState title="No splits match" sub="Clear filters or create a custom split." />}
        </div>
      </div>
    </div>
  )
}
