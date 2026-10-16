import { Timer, Plus, Minus, X } from 'lucide-react'
import { useRestTimer, adjustRest, skipRest, startRest } from '../hooks/useRestTimer.js'

function fmt(s) {
  const m = Math.floor(s / 60), r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export default function RestTimer({ compact = false }) {
  const { active, left, total } = useRestTimer()
  if (!active) {
    if (compact) return null
    return (
      <div className="card p-3 flex items-center gap-2">
        <Timer size={18} />
        <span className="mono text-xs text-mut">REST TIMER IDLE</span>
        <button className="btn ml-auto" style={{ width: 'auto' }} onClick={() => startRest(90)}>START 1:30</button>
      </div>
    )
  }
  return (
    <div className="card p-3" style={{ borderColor: '#22c55e' }} role="timer" aria-label={`Rest ${fmt(left)} remaining`}>
      <div className="flex items-center gap-2">
        <Timer size={18} className="text-good" />
        <span className="mono text-[11px] tracking-widest">REST</span>
        <span className="text-2xl font-black mono ml-auto">{fmt(left)}</span>
      </div>
      <div className="progress mt-2"><div style={{ width: `${total ? (left / total) * 100 : 0}%`, background: '#22c55e' }} /></div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <button className="btn" onClick={() => adjustRest(30)}><Plus size={14} className="inline" />30</button>
        <button className="btn" onClick={() => adjustRest(-30)}><Minus size={14} className="inline" />30</button>
        <button className="btn" onClick={skipRest}><X size={14} className="inline" /> SKIP</button>
      </div>
    </div>
  )
}
