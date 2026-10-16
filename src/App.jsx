import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { StoreProvider } from './hooks/useWorkoutStore.jsx'
import BottomNav from './components/BottomNav.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Workout from './pages/Workout.jsx'
import WorkoutComplete from './pages/WorkoutComplete.jsx'
import Muscles from './pages/Muscles.jsx'
import MuscleDetail from './pages/MuscleDetail.jsx'
import History from './pages/History.jsx'
import SessionDetail from './pages/SessionDetail.jsx'
import Progress from './pages/Progress.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import ExerciseProgress from './pages/ExerciseProgress.jsx'
import Settings from './pages/Settings.jsx'
import Splits from './pages/Splits.jsx'
import SplitDetail from './pages/SplitDetail.jsx'
import Setup from './pages/Setup.jsx'
import CustomSplit from './pages/CustomSplit.jsx'
import Admin from './pages/Admin.jsx'
import AdminLogin, { AdminGuard } from './pages/AdminLogin.jsx'
import { LoadingScreen } from './components/Brand.jsx'
import { Login, Signup, ForgotPassword } from './pages/Auth.jsx'

function Guard({ children }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />
  return children
}

function Shell() {
  const { user, loading } = useAuth()
  const loc = useLocation()
  const hideNav = ['/login', '/signup', '/forgot', '/admin/login'].includes(loc.pathname)
  if (loading) return <LoadingScreen />
  return (
    <div className="no-hscroll min-h-screen" style={{ background: '#09090B' }}>
      <div className="pb-20">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/" element={<Guard><Dashboard /></Guard>} />
          <Route path="/workout" element={<Guard><Workout /></Guard>} />
          <Route path="/complete" element={<Guard><WorkoutComplete /></Guard>} />
          <Route path="/splits" element={<Guard><Splits /></Guard>} />
          <Route path="/splits/new" element={<Guard><CustomSplit /></Guard>} />
          <Route path="/splits/:id" element={<Guard><SplitDetail /></Guard>} />
          <Route path="/setup" element={<Guard><Setup /></Guard>} />
          <Route path="/muscles" element={<Guard><Muscles /></Guard>} />
          <Route path="/muscles/:name" element={<Guard><MuscleDetail /></Guard>} />
          <Route path="/history" element={<Guard><History /></Guard>} />
          <Route path="/history/:date" element={<Guard><SessionDetail /></Guard>} />
          <Route path="/progress" element={<Guard><Progress /></Guard>} />
          <Route path="/leaderboard" element={<Guard><Leaderboard /></Guard>} />
          <Route path="/exercise/:muscle/:name" element={<Guard><ExerciseProgress /></Guard>} />
          <Route path="/settings" element={<Guard><Settings /></Guard>} />
          <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!hideNav && user && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </AuthProvider>
  )
}
