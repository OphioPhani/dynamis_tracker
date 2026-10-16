import { RANK_META, GROUP_COLORS } from '../data/workoutPlan.js'
import { LogoMark } from './Brand.jsx'

export function RankBadge({ rank }) {
  const r = RANK_META[rank]
  const cls = rank === 'good' ? 'badge-good' : rank === 'better' ? 'badge-better' : 'badge-best'
  const dot = rank === 'good' ? '🟢' : rank === 'better' ? '🟡' : '🔵'
  return <span className={`badge ${cls}`}>{dot} {r.label}</span>
}

export function ProgressBar({ pct, color = '#22c55e' }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin="0" aria-valuemax="100">
      <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
    </div>
  )
}

export function Header({ title, sub, right }) {
  return (
    <div className="sticky top-0 z-30 px-4 pt-3 pb-3" style={{ background: '#09090B', borderBottom: '1px solid #2a2e34' }}>
      <div className="flex items-center gap-2 max-w-md mx-auto pb-2">
        <LogoMark size={28} />
        <span className="font-black tracking-widest text-sm">DYNAMIS TRACKER</span>
      </div>
      <div className="flex items-start justify-between gap-2 max-w-md mx-auto">
        <div>
          <h1 className="text-xl font-black leading-tight">{title}</h1>
          {sub && <p className="text-xs text-mut mt-0.5">{sub}</p>}
        </div>
        {right}
      </div>
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', sub = '', logo = true }) {
  return (
    <div className="card p-4 text-center">
      {logo && <div className="flex justify-center mb-2 opacity-80"><LogoMark size={44} /></div>}
      <div className="font-black">{title}</div>
      {sub && <div className="text-xs text-mut mt-1">{sub}</div>}
    </div>
  )
}

export function GroupDot({ group }) {
  return <span style={{ color: GROUP_COLORS[group] || '#fff' }}>■</span>
}
