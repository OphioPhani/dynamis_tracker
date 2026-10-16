import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { Header, EmptyState } from '../components/ui.jsx'
import { api } from '../lib/api.js'

export default function Leaderboard() {
  const [state, setState] = useState({ loading: true, rows: [], lifters: 0, error: '' })

  useEffect(() => {
    let live = true
    ;(async () => {
      try {
        const { leaderboard, lifters } = await api.leaderboard()
        if (live) setState({ loading: false, rows: leaderboard || [], lifters: lifters || 0, error: '' })
      } catch (e) {
        if (live) setState({ loading: false, rows: [], lifters: 0, error: e.message || 'Leaderboard unavailable.' })
      }
    })()
    return () => { live = false }
  }, [])

  const mine = state.rows.find((r) => r.isMe)

  return (
    <div className="no-hscroll">
      <Header title="LEADERBOARD" sub={`${state.lifters} lifters · display names only`} />
      <div className="p-3 space-y-2 max-w-md mx-auto pb-24">
        {state.loading && <div className="card p-4 mono text-sm text-center">LOADING...</div>}
        {!state.loading && state.error && (
          <div className="card p-4 text-center">
            <div className="mono text-sm">⚠ {state.error}</div>
            <div className="text-xs text-mut mt-1">Log in to sync and appear on the leaderboard.</div>
          </div>
        )}
        {!state.loading && !state.error && mine && (
          <div className="card p-3" style={{ borderColor: '#22c55e' }}>
            <div className="mono text-[11px] text-mut">YOUR RANK</div>
            <div className="font-black text-lg">#{mine.rank} · {mine.displayName} · {mine.overallScore} PTS</div>
          </div>
        )}
        {!state.loading && !state.error && !state.rows.length && (
          <EmptyState title="No lifters yet" sub="Log workouts to join the leaderboard." />
        )}
        {state.rows.map((r) => (
          <div key={`${r.rank}-${r.displayName}`} className="card p-3" style={r.isMe ? { borderColor: '#22c55e' } : undefined}>
            <div className="flex items-center gap-2">
              <span className="mono font-black w-8">#{r.rank}</span>
              {r.rank <= 3 && <Trophy size={15} style={{ color: r.rank === 1 ? '#eab308' : '#9aa0a8' }} />}
              <b className="text-sm flex-1">{r.displayName}</b>
              <span className="mono text-sm font-black">{r.overallScore}</span>
            </div>
            <div className="mono text-[10px] text-mut mt-1">
              {r.totalWorkouts} WORKOUTS · {Number(r.totalVolume).toLocaleString()} KG · {r.currentStreak} DAY STREAK · {r.muscleCoverageScore}/45 MUSCLES
            </div>
          </div>
        ))}
        <Link to="/progress" className="btn text-center">BACK TO PROGRESS</Link>
      </div>
    </div>
  )
}
