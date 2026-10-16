import { useState } from 'react'
import { Check, ChevronDown, Minus, Plus, Pencil, Trash2 } from 'lucide-react'
import { RankBadge } from './ui.jsx'
import { startRest } from '../hooks/useRestTimer.js'
import { useStore } from '../hooks/useWorkoutStore.jsx'

export default function ExerciseCard({ day, muscle, group, exercise, rank, setsLogged, plannedSets, status, logCtx, defaultExpanded, onLogged }) {
  const { logSet, repeatLastSet, editSet, deleteSet, settings } = useStore()
  const [open, setOpen] = useState(false)
  const [viewLog, setViewLog] = useState(false)
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [msg, setMsg] = useState('')
  const [editing, setEditing] = useState(null)

  const planned = plannedSets || parseInt(exercise.sets) || 3
  const done = setsLogged.length
  const exStatus = status || (done >= planned ? 'COMPLETED' : done > 0 ? 'IN_PROGRESS' : 'NOT_STARTED')
  const expanded = defaultExpanded || viewLog || exStatus !== 'COMPLETED'

  async function submit(e) {
    e?.preventDefault()
    setMsg('')
    try {
      await logSet({ muscle, rank, weight: Number(weight), reps: Number(reps), day, exerciseName: exercise.name, equipment: exercise.equipment, workoutDate: logCtx?.workoutDate, workoutDay: logCtx?.workoutDay || day, sessionSeq: logCtx?.sessionSeq })
      setMsg('✓ SAVED')
      setWeight('')
      setReps('')
      startRest(90)
      onLogged?.()
    } catch (err) { setMsg('⚠ ' + (err.message || 'FAILED TO SAVE')) }
  }

  async function repeat() {
    setMsg('')
    try {
      await repeatLastSet(muscle, logCtx || {})
      setMsg('✓ SAVED')
      startRest(90)
      onLogged?.()
    } catch (err) { setMsg('⚠ ' + err.message) }
  }

  return (
    <article className="card" style={{ borderLeft: `4px solid ${rank === 'good' ? '#22c55e' : rank === 'better' ? '#eab308' : '#3b82f6'}`, opacity: exStatus === 'COMPLETED' && !viewLog ? 0.95 : 1 }}>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <RankBadge rank={rank} />
          <span className="mono text-[10px] text-mut">
            {exStatus === 'COMPLETED' ? `✓ COMPLETED ${done}/${planned}` : exStatus === 'IN_PROGRESS' ? `${done}/${planned} SETS · CONTINUE` : `NOT STARTED · ${planned} SETS PLANNED`}
          </span>
        </div>
        <h3 className="font-black text-base mt-1 leading-tight">{exStatus === 'COMPLETED' && !viewLog ? `✓ ${exercise.name.toUpperCase()}` : exercise.name.toUpperCase()}</h3>
        <div className="mono text-[11px] text-mut mt-0.5">{muscle} · {exercise.sets} × {exercise.reps} · REST {exercise.rest}</div>
        <div className="text-xs mt-1"><b>Equip:</b> {exercise.equipment}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="mono text-[10px] px-1.5 py-0.5" style={{ border: '1px solid #2a2e34' }}>[ {exercise.grip.toUpperCase()} ]</span>
          <span className="mono text-[10px] px-1.5 py-0.5" style={{ border: '1px solid #2a2e34' }}>[ {exercise.gripDetail.toUpperCase()} ]</span>
        </div>

        {/* COMPLETED: persistent state — view/edit the existing log, never re-log blindly */}
        {exStatus === 'COMPLETED' && !viewLog && (
          <div className="mt-2">
            <div className="mono text-[11px] text-good">COMPLETED · {done} SETS</div>
            <div className="text-xs text-mut mt-0.5">{setsLogged.map((s) => `${s.weight} ${settings.unit} × ${s.reps}`).join(' · ')}</div>
            <button className="btn mt-2" onClick={() => setViewLog(true)}>[ VIEW LOG ]</button>
          </div>
        )}

        {(expanded || viewLog) && (
        <>
        <form onSubmit={submit} className="grid grid-cols-2 gap-2 mt-3">
          <label className="block">
            <span className="mono text-[10px] text-mut">WEIGHT ({settings.unit.toUpperCase()})</span>
            <input type="number" inputMode="decimal" min="0" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="20" aria-label={`Weight for ${exercise.name}`} required />
          </label>
          <label className="block">
            <span className="mono text-[10px] text-mut">REPS</span>
            <input type="number" inputMode="numeric" min="1" step="1" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="12" aria-label={`Reps for ${exercise.name}`} required />
          </label>
          <button type="submit" className="btn btn-primary col-span-2" style={{ minHeight: 52 }}>✓ COMPLETE SET</button>
        </form>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button className="btn" style={{ minHeight: 48 }} onClick={repeat}>REPEAT LAST SET</button>
          <button className="btn" style={{ minHeight: 48 }} onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? 'HIDE DETAILS' : 'INSTRUCTIONS'} <ChevronDown size={14} className="inline" />
          </button>
        </div>
        {exStatus === 'COMPLETED' && viewLog && (
          <button className="btn mt-2" onClick={() => setViewLog(false)}>[ HIDE LOG ]</button>
        )}
        {msg && <div className="mono text-[11px] mt-2" role="status">{msg}</div>}

        {setsLogged.length > 0 && (
          <div className="mt-2" style={{ borderTop: '1px solid #2a2e34', paddingTop: 8 }}>
            <div className="mono text-[10px] text-mut mb-1">SESSION SETS — EDITABLE, NEVER DUPLICATED</div>
            {setsLogged.map((s) => (
              <div key={s.localId} className="flex items-center gap-2 text-sm py-1.5" style={{ borderBottom: '1px solid #1e2126' }}>
                <Check size={14} className="text-good" />
                <span className="font-bold">{s.weight} {settings.unit} × {s.reps}</span>
                <span className="mono text-[10px] text-mut ml-auto">{new Date(s.performedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                <button aria-label="Edit set" className="p-2" style={{ minHeight: 44, minWidth: 44 }} onClick={() => setEditing(s.localId)}><Pencil size={15} /></button>
                <button aria-label="Delete set" className="p-2" style={{ minHeight: 44, minWidth: 44 }} onClick={() => deleteSet(s.localId)}><Trash2 size={15} /></button>
              </div>
            ))}
            {editing && (
              <EditRow
                entry={setsLogged.find((s) => s.localId === editing)}
                onClose={() => setEditing(null)}
                onSave={async (w, r) => { await editSet(editing, { weight: Number(w), reps: Number(r) }); setEditing(null); onLogged?.() }}
              />
            )}
          </div>
        )}
        </>
        )}

        {open && (
          <div className="text-xs mt-2 p-2 space-y-1" style={{ background: '#0f1113', border: '1px solid #2a2e34' }}>
            <div><b>Setup:</b> {exercise.equipment} · Grip {exercise.grip} ({exercise.gripDetail})</div>
            <div><b>Execution:</b> {exercise.technique}</div>
            <div><b>Breathing:</b> Exhale on effort, inhale on return. Brace lightly for spinal stabilizers.</div>
            <div><b>Cue:</b> {exercise.formCue}</div>
            <div><b>Primary:</b> {(exercise.primary || []).join(', ')}</div>
            <div><b>Secondary:</b> {(exercise.secondary || []).join(', ')}</div>
            <div><b>Stabilizers:</b> {(exercise.stabilizers || []).join(', ')}</div>
          </div>
        )}
      </div>
    </article>
  )
}

function EditRow({ entry, onClose, onSave }) {
  const [w, setW] = useState(entry.weight)
  const [r, setR] = useState(entry.reps)
  return (
    <form
      className="flex items-center gap-2 mt-2"
      onSubmit={(e) => { e.preventDefault(); onSave(w, r) }}
    >
      <input type="number" inputMode="decimal" value={w} onChange={(e) => setW(e.target.value)} aria-label="Edit weight" style={{ maxWidth: 90 }} />
      <span>×</span>
      <input type="number" inputMode="numeric" value={r} onChange={(e) => setR(e.target.value)} aria-label="Edit reps" style={{ maxWidth: 80 }} />
      <button className="btn" type="submit" style={{ width: 'auto' }}>SAVE</button>
      <button className="btn" type="button" style={{ width: 'auto' }} onClick={onClose}>X</button>
    </form>
  )
}

export function QuickStepper({ value, onChange, step = 2.5, min = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" className="btn" style={{ width: 52 }} onClick={() => onChange(Math.max(min, Number(value || 0) - step))} aria-label="Decrease"><Minus size={16} /></button>
      <span className="font-black flex-1 text-center">{value || 0}</span>
      <button type="button" className="btn" style={{ width: 52 }} onClick={() => onChange(Number(value || 0) + step)} aria-label="Increase"><Plus size={16} /></button>
    </div>
  )
}
