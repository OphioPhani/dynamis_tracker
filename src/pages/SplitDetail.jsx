import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header, EmptyState } from '../components/ui.jsx'
import { getSplitById, splitMuscleUnion } from '../data/splits.js'
import { generateWorkoutFromSplit } from '../utils/splitEngine.js'

const FOCUS_LABEL = {
  'Pectoralis major': 'Chest', 'Pectoralis minor': 'Chest', 'Subclavius': 'Chest', 'Serratus anterior': 'Chest',
  'Anterior deltoid': 'Shoulders', 'Lateral deltoid': 'Shoulders', 'Posterior deltoid': 'Shoulders',
  'Supraspinatus': 'Cuff', 'Infraspinatus': 'Cuff', 'Teres minor': 'Cuff', 'Subscapularis': 'Cuff',
  'Biceps brachii': 'Arms', 'Brachialis': 'Arms', 'Brachioradialis': 'Arms', 'Triceps brachii': 'Arms',
  'Forearm flexors': 'Arms', 'Forearm extensors': 'Arms',
  'Trapezius': 'Back', 'Rhomboids': 'Back', 'Rhomboid major': 'Back', 'Rhomboid minor': 'Back',
  'Teres major': 'Back', 'Levator scapulae': 'Back', 'Latissimus dorsi': 'Back', 'Erector spinae': 'Back',
  'Quadriceps': 'Legs', 'Rectus femoris': 'Legs', 'Hamstrings': 'Legs', 'Glutes': 'Legs',
  'Gluteus maximus': 'Legs', 'Adductors': 'Legs', 'Calves': 'Legs', 'Tibialis anterior': 'Legs',
  'Iliopsoas': 'Legs', 'Tensor fasciae latae': 'Legs',
  'Rectus abdominis': 'Core', 'External obliques': 'Core', 'Internal obliques': 'Core',
  'Transverse abdominis': 'Core', 'Multifidus': 'Core', 'Quadratus lumborum': 'Core',
  'Rotatores': 'Core', 'Semispinalis': 'Core', 'Diaphragm': 'Core', 'Pelvic floor': 'Core'
}

function dayFocus(day) {
  const groups = [...new Set((day.muscles || []).map((m) => FOCUS_LABEL[m.muscle] || 'Other'))]
  return groups.join(' · ')
}

export default function SplitDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { activeSplitId, customSplits, useSplit, customizeSplit, availableEquipment, logs } = useStore()
  const [confirm, setConfirm] = useState(false)
  const [msg, setMsg] = useState('')
  const split = getSplitById(id, customSplits)
  if (!split) return <div className="p-4 max-w-md mx-auto"><EmptyState title="Split not found" /><Link to="/splits" className="btn mt-2">BACK</Link></div>

  const union = splitMuscleUnion(split)
  const restDays = split.days.filter((d) => d.isRestDay).map((d) => d.dayOfWeek)
  const sched = generateWorkoutFromSplit(split, availableEquipment)
  const isActive = split.id === activeSplitId
  const hadHistory = logs.length > 0

  async function apply() {
    setMsg('LOADING...')
    await useSplit(split.id)
    setMsg('✓ Split activated — history preserved.')
    setTimeout(() => nav('/workout'), 700)
  }

  async function customize() {
    setMsg('LOADING...')
    const newId = await customizeSplit(split.id)
    setMsg('✓ Personal copy created — original preset untouched.')
    setTimeout(() => nav(`/splits/${newId}`), 700)
  }

  return (
    <div className="no-hscroll">
      <Header title={split.name.toUpperCase()} sub={`${split.daysPerWeek} DAYS/WEEK · ${split.category.toUpperCase()}`} />
      <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
        <div className="card p-3">
          <div className="flex items-center gap-2">
            {split.badge && <span className="badge" style={{ background: '#fff', color: '#000' }}>{split.badge}</span>}
            {!split.isPreset && <span className="badge badge-best">CUSTOM</span>}
            {isActive && <span className="badge badge-good">ACTIVE</span>}
          </div>
          <p className="text-sm mt-2">{split.description}</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-center">
            <div className="card2 p-2"><div className="mono text-[10px] text-mut">TRAINING FREQUENCY</div><div className="font-black">{split.daysPerWeek} DAYS/WK</div></div>
            <div className="card2 p-2"><div className="mono text-[10px] text-mut">REST DAYS</div><div className="font-black text-xs">{restDays.join(' + ') || 'NONE'}</div></div>
          </div>
        </div>

        <div className="card p-3">
          <div className="mono text-[11px] text-mut mb-2">STRUCTURE</div>
          {split.days.map((d) => (
            <div key={d.dayOfWeek} className="flex gap-2 py-1.5 text-sm" style={{ borderTop: '1px solid #1e2126' }}>
              <span className="mono text-[11px] w-20 shrink-0">{d.dayOfWeek.slice(0, 3).toUpperCase()}</span>
              <div>
                <b>{d.isRestDay ? 'REST' : d.name}</b>
                {!d.isRestDay && <div className="text-xs text-mut">{dayFocus(d)} · {(d.muscles || []).length} muscles</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="card p-3">
          <div className="mono text-[11px] text-mut mb-1">EXPECTED COVERAGE — {union.length} MUSCLES</div>
          <div className="text-xs text-mut">{union.join(', ')}</div>
        </div>

        {!confirm ? (
          <div className="space-y-2">
            {!isActive && <button className="btn btn-primary" style={{ minHeight: 54 }} onClick={() => (hadHistory ? setConfirm(true) : apply())}>USE {split.name.toUpperCase()}</button>}
            {isActive && <div className="card p-3 text-center font-black text-good">✓ CURRENT SPLIT</div>}
            {(split.isPreset) && <button className="btn" onClick={customize}>CUSTOMIZE SPLIT (SAVE MY COPY)</button>}
            {(!split.isPreset) && <Link to="/splits/new" className="btn text-center">EDIT MY CUSTOM SPLIT</Link>}
            <Link to="/splits" className="btn text-center">BACK TO LIBRARY</Link>
          </div>
        ) : (
          <div className="card p-4" style={{ borderColor: '#eab308' }}>
            <b>CHANGE WORKOUT SPLIT?</b>
            <p className="text-sm text-mut mt-1">Changing your split will create a new weekly workout schedule. Your previous workout history will remain unchanged.</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button className="btn" onClick={() => setConfirm(false)}>CANCEL</button>
              <button className="btn btn-primary" onClick={apply}>CHANGE SPLIT</button>
            </div>
          </div>
        )}
        {msg && <div className="mono text-xs" role="status">{msg}</div>}
        <div className="mono text-[10px] text-mut">Schedule preview uses your equipment ({sched.flatMap((d) => d.items).filter((i) => i.exercise).length} exercises auto-matched).</div>
      </div>
    </div>
  )
}
