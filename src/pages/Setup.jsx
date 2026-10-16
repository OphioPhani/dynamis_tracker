import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header } from '../components/ui.jsx'
import { EQUIPMENT_LIST } from '../data/equipment.js'
import { SPLIT_TEMPLATES } from '../data/splits.js'
import { recommendSplit } from '../utils/splitEngine.js'

export default function Setup() {
  const nav = useNavigate()
  const { useSplit, setEquipment, availableEquipment } = useStore()
  const [step, setStep] = useState(1)
  const [splitId, setSplitId] = useState('snake-split')
  const [equip, setEquip] = useState(() => availableEquipment?.length ? availableEquipment : EQUIPMENT_LIST)
  const [days, setDays] = useState('5')
  const [exp, setExp] = useState('Intermediate')
  const [goal, setGoal] = useState('Hypertrophy')
  const [msg, setMsg] = useState('')

  const reco = useMemo(() => recommendSplit({ daysPerWeek: Number(days), experience: exp, goal }), [days, exp, goal])
  const recoName = SPLIT_TEMPLATES.find((s) => s.id === reco)?.name

  function toggle(k) {
    setEquip((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]))
  }

  async function finish() {
    if (!equip.length) { setMsg('⚠ Select at least one equipment option.'); return }
    setMsg('LOADING...')
    setEquipment(equip)
    await useSplit(splitId)
    setMsg('✓ Your workout is ready.')
    setTimeout(() => nav('/workout'), 600)
  }

  return (
    <div className="no-hscroll">
      <Header title="CHOOSE YOUR WORKOUT SPLIT" sub={`Step ${step} of 3 — no manual setup needed`} />
      <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
        <div className="progress"><div style={{ width: `${(step / 3) * 100}%`, background: '#fff' }} /></div>

        {step === 1 && (
          <section className="space-y-2">
            <div className="card p-3">
              <div className="mono text-[11px] text-mut mb-2">DON'T KNOW WHICH SPLIT TO USE?</div>
              <div className="grid grid-cols-3 gap-2">
                <label className="block"><span className="mono text-[10px] text-mut">DAYS/WK</span>
                  <select value={days} onChange={(e) => setDays(e.target.value)}>{['3', '4', '5', '6'].map((d) => <option key={d}>{d}</option>)}</select></label>
                <label className="block"><span className="mono text-[10px] text-mut">EXPERIENCE</span>
                  <select value={exp} onChange={(e) => setExp(e.target.value)}>{['Beginner', 'Intermediate', 'Advanced'].map((d) => <option key={d}>{d}</option>)}</select></label>
                <label className="block"><span className="mono text-[10px] text-mut">GOAL</span>
                  <select value={goal} onChange={(e) => setGoal(e.target.value)}>{['Hypertrophy', 'Strength', 'Bodybuilding', 'Full body'].map((d) => <option key={d}>{d}</option>)}</select></label>
              </div>
              <div className="text-xs mt-2">Based on your availability, <b>{recoName}</b> may be a good starting option. <button className="underline" onClick={() => setSplitId(reco)}>Use recommendation</button></div>
            </div>
            {SPLIT_TEMPLATES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSplitId(s.id)}
                className="card p-3 text-left w-full"
                style={splitId === s.id ? { borderColor: '#22c55e' } : undefined}
                aria-pressed={splitId === s.id}
              >
                <div className="flex items-center gap-2">
                  <span style={{ border: '1px solid #2a2e34', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {splitId === s.id && <Check size={14} />}
                  </span>
                  <b className="text-sm">{s.name.toUpperCase()}</b>
                  {s.badge && <span className="badge" style={{ background: '#fff', color: '#000' }}>{s.badge}</span>}
                </div>
                <div className="mono text-[11px] text-mut mt-1">{s.daysPerWeek} DAYS/WK · {s.level.toUpperCase()}</div>
              </button>
            ))}
            <button className="btn btn-primary" style={{ minHeight: 52 }} onClick={() => setStep(2)}>CONTINUE → EQUIPMENT</button>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-2">
            <div className="card p-3">
              <div className="mono text-[11px] text-mut">MY GYM EQUIPMENT</div>
              <div className="text-xs text-mut">Workouts auto-pick the highest-ranked exercise your gym supports.</div>
            </div>
            <div className="card p-3 grid grid-cols-1 gap-1.5">
              {EQUIPMENT_LIST.map((e) => (
                <button key={e} onClick={() => toggle(e)} className="flex items-center gap-2 text-left p-2 text-sm" style={{ border: '1px solid #2a2e34', background: equip.includes(e) ? '#1b1e22' : 'transparent', minHeight: 48 }} aria-pressed={equip.includes(e)}>
                  <span style={{ border: '1px solid #2a2e34', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: equip.includes(e) ? '#22c55e' : 'transparent' }}>
                    {equip.includes(e) && <Check size={14} color="#04120a" />}
                  </span>
                  {e}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn" onClick={() => setStep(1)}>← BACK</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>CONTINUE →</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-2">
            <div className="card p-4 text-center" style={{ borderTop: '4px solid #22c55e' }}>
              <div className="text-3xl">✓</div>
              <h2 className="font-black text-lg">YOUR WORKOUT IS READY</h2>
              <p className="text-sm text-mut mt-1">Split: <b className="text-white">{SPLIT_TEMPLATES.find((s) => s.id === splitId)?.name}</b> · {equip.length} equipment selected</p>
              <button className="btn btn-primary mt-3" style={{ minHeight: 54 }} onClick={finish}>START TODAY'S WORKOUT</button>
              {msg && <div className="mono text-xs mt-2" role="status">{msg}</div>}
            </div>
            <button className="btn" onClick={() => setStep(2)}>← BACK</button>
            <Link to="/splits" className="btn text-center">BROWSE ALL SPLITS</Link>
          </section>
        )}
      </div>
    </div>
  )
}
