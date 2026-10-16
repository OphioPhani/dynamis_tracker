import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function WeekBarChart({ data }) {
  // data: [{day, muscles}]
  const rows = DAYS.map((d) => ({ day: d.slice(0, 3), muscles: data?.[d] ?? 0 }))
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#2a2e34" strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fill: '#9aa0a8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#9aa0a8', fontSize: 11 }} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#111316', border: '1px solid #2a2e34', color: '#fff' }} />
          <Bar dataKey="muscles" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ProgressLine({ data }) {
  // data: [{label, weight}]
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid stroke="#2a2e34" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: '#9aa0a8', fontSize: 10 }} />
          <YAxis tick={{ fill: '#9aa0a8', fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#111316', border: '1px solid #2a2e34', color: '#fff' }} />
          <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
