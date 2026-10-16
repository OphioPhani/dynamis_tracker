import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, Layers, History, TrendingUp, Settings } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'HOME', icon: Home, end: true },
  { to: '/workout', label: 'WORKOUT', icon: Dumbbell },
  { to: '/muscles', label: 'MUSCLES', icon: Layers },
  { to: '/history', label: 'HISTORY', icon: History },
  { to: '/progress', label: 'PROGRESS', icon: TrendingUp },
  { to: '/settings', label: 'MORE', icon: Settings }
]

export default function BottomNav() {
  return (
    <nav aria-label="Primary" className="fixed bottom-0 left-0 right-0 z-40 safe-bottom" style={{ background: '#0f1113', borderTop: '2px solid #2a2e34' }}>
      <div className="grid grid-cols-6 max-w-md mx-auto">
        {ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-extrabold tracking-widest ${isActive ? 'text-white' : 'text-mut'}`
            }
            style={({ isActive }) => (isActive ? { background: '#1b1e22', boxShadow: 'inset 0 2px 0 #fff' } : undefined)}
          >
            <it.icon size={20} strokeWidth={2.2} />
            {it.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
