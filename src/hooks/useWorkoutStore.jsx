import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import { enqueueLog, getQueue, clearQueue, replaceQueued, dropQueued } from '../lib/offlineQueue.js'
import { useAuth } from './useAuth.jsx'
import { getSplitById } from '../data/splits.js'
import { EQUIPMENT_LIST } from '../data/equipment.js'
import { scheduleForDay } from '../utils/splitEngine.js'
import { getIndiaDateString, indiaDateStringOfTimestamp, logIndiaDate } from '../utils/dateUtils.js'
import { sessionKey, logsForSession } from '../utils/sessionState.js'
import { useOnline } from './useOnline.js'

const SEL_KEY = 'gmt_sel_v1'
const LOG_KEY = 'gmt_logs_v1'
const SET_KEY = 'gmt_settings_v1'
const SPLIT_KEY = 'gmt_active_split_v1'
const EQUIP_KEY = 'gmt_equip_v1'
const CUSTOM_KEY = 'gmt_custom_splits_v1'
const SESS_KEY = 'gmt_sessions_v1'
const SEQ_KEY = 'gmt_session_seq_v1'

const StoreCtx = createContext(null)

function loadJSON(k, fb) {
  try {
    const v = JSON.parse(localStorage.getItem(k) || 'null')
    if (v == null) return fb
    // Guard against corrupted/incorrectly-typed cached values: a single bad
    // entry must never crash the whole app (blank screen).
    if (Array.isArray(fb) && !Array.isArray(v)) return fb
    if (typeof fb === 'string' && typeof v !== 'string') return fb
    if (typeof fb === 'object' && !Array.isArray(fb) && (typeof v !== 'object' || Array.isArray(v))) return fb
    return v
  } catch { return fb }
}

function toLocalEntry(l) {
  return {
    localId: l.id, id: l.id, synced: true,
    muscle: l.ex_muscle || l.muscle || 'Unknown',
    rank: l.ex_rank || l.rank || 'good',
    exerciseName: l.ex_name || l.exerciseName || 'Exercise',
    equipment: l.ex_equipment || l.equipment || '',
    day: l.workout_day || l.day || l.ex_day || '',
    weight: Number(l.weight), reps: l.reps_completed ?? l.reps,
    performedAt: l.performed_at || l.performedAt, completed: l.completed ?? true,
    splitId: l.split_id ?? l.splitId ?? null, splitName: l.split_name ?? l.splitName ?? '',
    sessionId: l.session_id ?? l.sessionId ?? null, setNumber: l.set_number ?? l.setNumber ?? null,
    workoutDay: l.workout_day || l.workoutDay || l.day || l.ex_day || '',
    workoutDate: l.workout_date || l.workoutDate || null,
    sessionSeq: l.session_no ?? l.sessionSeq ?? 1
  }
}

export function StoreProvider({ children }) {
  const { user, demoMode } = useAuth()
  const online = useOnline()
  const serverUp = !!user && !demoMode
  const [selections, setSelections] = useState(() => loadJSON(SEL_KEY, {}))
  const [logs, setLogs] = useState(() => loadJSON(LOG_KEY, []))
  const [settings, setSettingsState] = useState(() => loadJSON(SET_KEY, { unit: 'kg', displayName: '' }))
  const [activeSplitId, setActiveSplitId] = useState(() => loadJSON(SPLIT_KEY, 'snake-split'))
  const [availableEquipment, setAvailableEquipment] = useState(() => loadJSON(EQUIP_KEY, EQUIPMENT_LIST))
  const [customSplits, setCustomSplits] = useState(() => loadJSON(CUSTOM_KEY, []))
  const [sessions, setSessions] = useState(() => loadJSON(SESS_KEY, {}))
  const [seqOverrides, setSeqOverrides] = useState(() => loadJSON(SEQ_KEY, {}))
  const [syncMsg, setSyncMsg] = useState('ONLINE')

  useEffect(() => { localStorage.setItem(SEL_KEY, JSON.stringify(selections)) }, [selections])
  useEffect(() => { localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-2000))) }, [logs])
  useEffect(() => { localStorage.setItem(SET_KEY, JSON.stringify(settings)) }, [settings])
  useEffect(() => { localStorage.setItem(SPLIT_KEY, JSON.stringify(activeSplitId)) }, [activeSplitId])
  useEffect(() => { localStorage.setItem(EQUIP_KEY, JSON.stringify(availableEquipment)) }, [availableEquipment])
  useEffect(() => { localStorage.setItem(CUSTOM_KEY, JSON.stringify(customSplits)) }, [customSplits])
  useEffect(() => { localStorage.setItem(SESS_KEY, JSON.stringify(sessions)) }, [sessions])
  useEffect(() => { localStorage.setItem(SEQ_KEY, JSON.stringify(seqOverrides)) }, [seqOverrides])

  const activeSplit = useMemo(
    () => getSplitById(activeSplitId === 'admin-split' ? 'snake-split' : activeSplitId, customSplits) || getSplitById('snake-split', customSplits),
    [activeSplitId, customSplits]
  )

  // Today's generated schedule with user rank-overrides applied
  function todayItems(dayName) {
    const sched = scheduleForDay(activeSplit, dayName, availableEquipment)
    if (!sched || sched.isRestDay) return { isRestDay: true, items: [], name: sched?.name || 'Rest' }
    const items = sched.items.map((it) => {
      const override = selections[it.muscle]
      if (override && override !== it.selectedRank) {
        const alt = it.alternatives.find((a) => a.rank === override)
        if (alt) return { ...it, selectedRank: alt.rank, exercise: alt.exercise }
      }
      return it
    })
    return { isRestDay: false, items, name: sched.name }
  }

  // ---- Backend bootstrap: days + selections + logs + prefs + customs ----
  useEffect(() => {
    if (!serverUp) return
    ;(async () => {
      try {
        await api.days().catch(() => null)
        try {
          const { selections: list } = await api.selections()
          if (list?.length) {
            const sel = {}
            for (const s of list) sel[s.muscle] = s.rank
            setSelections((prev) => ({ ...prev, ...sel }))
          }
        } catch {}
        try {
          const { logs: rlogs } = await api.logs({ limit: 2000 })
          if (rlogs?.length) {
            const mapped = rlogs.map(toLocalEntry)
            setLogs((prev) => {
              const ids = new Set(mapped.map((m) => m.localId))
              const local = prev.filter((p) => !p.synced && !ids.has(p.localId))
              return [...mapped, ...local].slice(0, 2000)
            })
          }
        } catch {}
        try {
          const { preferences: prefs } = await api.preferences()
          if (prefs) {
            if (prefs.active_split_id) setActiveSplitId(prefs.active_split_id)
            if (prefs.available_equipment?.length) setAvailableEquipment(prefs.available_equipment)
            if (prefs.weight_unit) setSettingsState((s) => ({ ...s, unit: prefs.weight_unit }))
          }
        } catch {}
        try {
          const { splits } = await api.splits()
          const customs = (splits || []).filter((s) => !s.isPreset).map((c) => ({
            id: c.id, name: c.name, description: c.description, category: 'Custom',
            level: c.level || 'Custom', goals: c.goals || [], tags: c.tags || [],
            daysPerWeek: c.daysPerWeek, isPreset: false, isPersonalPreset: false, days: c.days || []
          }))
          if (customs.length) {
            setCustomSplits((prev) => {
              const ids = new Set(customs.map((o) => o.id))
              return [...customs, ...prev.filter((p) => !ids.has(p.id))]
            })
          }
        } catch {}
        // display name into settings for the greeting
        try {
          const { user: me } = await api.me()
          if (me?.displayName) setSettingsState((s) => (s.displayName ? s : { ...s, displayName: me.displayName }))
        } catch {}
      } catch (e) { console.warn('backend bootstrap failed', e?.message) }
    })()
  }, [serverUp])

  // persist prefs to backend (debounced)
  useEffect(() => {
    if (!serverUp) return
    const t = setTimeout(async () => {
      try {
        await api.savePreferences({
          activeSplitId, weightUnit: settings.unit || 'kg', availableEquipment
        })
      } catch {}
    }, 800)
    return () => clearTimeout(t)
  }, [serverUp, activeSplitId, availableEquipment, settings.unit])

  // flush offline queue when back online
  useEffect(() => {
    if (!online || !serverUp) {
      if (!online) setSyncMsg('OFFLINE — SAVING LOCALLY')
      else if (!serverUp) setSyncMsg('LOCAL MODE — LOG IN TO SYNC')
      else setSyncMsg('ONLINE')
      return
    }
    const q = getQueue()
    if (!q.length) { setSyncMsg('SYNCED'); return }
    ;(async () => {
      setSyncMsg('SYNCING...')
      try {
        for (const item of q) {
          const r = await api.logSet({
            muscle: item.muscle, rank: item.rank, weight: item.weight, reps: item.reps,
            workoutDay: item.workoutDay || item.day || '',
            workoutDate: item.workoutDate || indiaDateStringOfTimestamp(item.performedAt),
            sessionSeq: item.sessionSeq || 1
          })
          if (r?.log) {
            const merged = { ...toLocalEntry(r.log), localId: item.localId }
            setLogs((prev) => prev.map((l) => (l.localId === item.localId ? merged : l)))
          }
        }
        clearQueue()
        setSyncMsg('SYNCED')
      } catch { setSyncMsg('ONLINE — WILL RETRY SYNC') }
    })()
  }, [online, serverUp])

  // Resolve the active session seq: explicit override (START NEW SESSION) else
  // highest seq already logged for the key, else none yet.
  function resolveSeq(workoutDate, splitId, workoutDay, allLogs) {
    const base = `${workoutDate}|${splitId || 'nosplit'}|${workoutDay}`
    const over = seqOverrides[base]
    if (over) return over
    let mx = 0
    for (const l of allLogs || logs) {
      if (logIndiaDate(l) === workoutDate && (l.splitId || null) === (splitId || null) &&
          (l.workoutDay || l.day || '') === workoutDay) mx = Math.max(mx, l.sessionSeq || 1)
    }
    return mx
  }

  // Get-or-create the session (local record; server row is created on log/status).
  // Never invents a new session on plain view: seq 0 with no logs means none yet.
  async function ensureSession({ workoutDate, workoutDay, splitId, splitName, sessionSeq }) {
    const key = sessionKey({ workoutDate, splitId, workoutDay, sessionSeq })
    const existing = sessions[key]
    if (existing?.sessionId || existing?.status) return { sessionId: existing.sessionId || null, sessionSeq, key }
    const rec = { sessionId: null, status: sessionSeq === 0 ? 'planned' : 'in_progress' }
    setSessions((prev) => ({ ...prev, [key]: rec }))
    return { sessionId: null, sessionSeq, key }
  }

  async function setSessionStatus({ workoutDate, workoutDay, splitId, splitName, sessionSeq, status }) {
    const key = sessionKey({ workoutDate, splitId, workoutDay, sessionSeq })
    setSessions((prev) => ({ ...prev, [key]: { sessionId: prev[key]?.sessionId || null, status } }))
    if (serverUp && sessionSeq > 0) {
      try {
        await api.setSessionStatus({ workoutDate, workoutDay, sessionSeq, splitId, status })
      } catch {}
    }
  }

  async function persistCustomSplit(split, isUpdate) {
    if (!serverUp) return
    try {
      const payload = {
        name: split.name, description: split.description, level: split.level,
        goals: split.goals, tags: split.tags, days: split.days
      }
      if (isUpdate) await api.updateSplit(split.id, payload)
      else {
        const { split: created } = await api.createSplit(payload)
        if (created && created.id !== split.id) {
          const oldId = split.id
          setCustomSplits((prev) => prev.map((s) => (s.id === oldId ? { ...s, id: created.id } : s)))
          if (activeSplitId === oldId) setActiveSplitId(created.id)
        }
      }
    } catch {}
  }

  const apiMem = useMemo(() => ({
    selections, logs, settings, syncMsg, online,
    backendReady: serverUp,
    activeSplitId, activeSplit, availableEquipment, customSplits, sessions,

    setSelection: async (muscle, rank) => {
      setSelections((prev) => {
        const next = { ...prev }
        if (next[muscle] === rank) delete next[muscle]
        else next[muscle] = rank
        return next
      })
      if (serverUp) {
        try {
          const { selections: list } = await api.setSelection(muscle, rank)
          if (list) {
            const sel = {}
            for (const s of list) sel[s.muscle] = s.rank
            setSelections(sel)
          }
        } catch {}
      }
    },

    todayItems,

    // Session-scoped logging: sets append to ONE exercise block per session.
    // Reopening a completed exercise shows VIEW LOG — never a duplicate entry.
    logSet: async ({ muscle, rank, weight, reps, day, exerciseName, equipment, workoutDate, workoutDay, sessionSeq }) => {
      if (!(weight >= 0) || !(reps >= 0)) throw new Error('Enter valid weight and reps.')
      if (!reps) throw new Error('Reps must be at least 1.')
      const wDay = workoutDay || day || ''
      const wDate = workoutDate || getIndiaDateString()
      const sId = activeSplit?.id || null
      const sName = activeSplit?.name || ''
      const seq = sessionSeq || resolveSeq(wDate, sId, wDay) + 0 || 0
      const useSeq = seq > 0 ? seq : 1
      const { sessionId } = await ensureSession({ workoutDate: wDate, workoutDay: wDay, splitId: sId, splitName: sName, sessionSeq: useSeq })
      const setNo = logs.filter((l) => logIndiaDate(l) === wDate && (l.splitId || null) === (sId || null) &&
        (l.workoutDay || l.day || '') === wDay && (l.sessionSeq || 1) === useSeq && l.muscle === muscle).length + 1
      const entry = {
        localId: 'l' + Date.now() + Math.floor(Math.random() * 1e6),
        muscle, rank, exerciseName, equipment: equipment || '',
        weight: Number(weight), reps: Number(reps),
        performedAt: new Date().toISOString(), day: wDay,
        completed: true, synced: false,
        splitId: sId, splitName: sName,
        workoutDay: wDay, workoutDate: wDate, sessionSeq: useSeq, sessionId, setNumber: setNo
      }
      setLogs((prev) => [entry, ...prev].slice(0, 2000))
      if (!online || !serverUp) {
        if (!online) enqueueLog(entry)
        return entry
      }
      try {
        const { log } = await api.logSet({
          muscle, rank, weight: entry.weight, reps: entry.reps,
          workoutDay: wDay, workoutDate: wDate, sessionSeq: useSeq
        })
        if (log) {
          const merged = { ...toLocalEntry(log), localId: entry.localId }
          setLogs((prev) => prev.map((l) => (l.localId === entry.localId ? merged : l)))
          return merged
        }
      } catch { enqueueLog(entry) }
      return entry
    },

    repeatLastSet: async (muscle, ctx = {}) => {
      const scope = logs.filter((l) =>
        (!ctx.workoutDate || logIndiaDate(l) === ctx.workoutDate) &&
        (!ctx.workoutDay || (l.workoutDay || l.day || '') === ctx.workoutDay) &&
        (!ctx.sessionSeq || (l.sessionSeq || 1) === ctx.sessionSeq))
      const last = scope.find((l) => l.muscle === muscle) || logs.find((l) => l.muscle === muscle)
      if (!last) throw new Error('No previous set to repeat.')
      return apiMem.logSet({ muscle: last.muscle, rank: last.rank, weight: last.weight, reps: last.reps, day: last.workoutDay || last.day, exerciseName: last.exerciseName, equipment: last.equipment, workoutDate: ctx.workoutDate, workoutDay: ctx.workoutDay || last.workoutDay || last.day, sessionSeq: ctx.sessionSeq })
    },

    // Session lifecycle (persisted locally + backend; reopening never forks implicitly)
    resolveSeq, ensureSession, setSessionStatus,
    activeSeqFor: ({ workoutDate, splitId, workoutDay }) => {
      const base = `${workoutDate}|${splitId || 'nosplit'}|${workoutDay}`
      if (seqOverrides[base]) return seqOverrides[base]
      return resolveSeq(workoutDate, splitId, workoutDay, logs) || 0
    },
    sessionLogs: (args) => logsForSession(logs, args),
    startNewSession: async ({ workoutDate, workoutDay }) => {
      const sId = activeSplit?.id || null
      const sName = activeSplit?.name || ''
      const next = resolveSeq(workoutDate, sId, workoutDay, logs) + 1
      const base = `${workoutDate}|${sId || 'nosplit'}|${workoutDay}`
      setSeqOverrides((prev) => ({ ...prev, [base]: next }))
      await ensureSession({ workoutDate, workoutDay, splitId: sId, splitName: sName, sessionSeq: next })
      return next
    },

    editSet: async (localId, patch) => {
      let cur = null
      setLogs((prev) => prev.map((l) => {
        if (l.localId !== localId) return l
        cur = { ...l, ...patch, synced: false }
        return cur
      }))
      if (cur) replaceQueued(cur)
      if (serverUp && cur?.id) {
        try {
          await api.editSet(cur.id, { weight: patch.weight ?? cur.weight, reps: patch.reps ?? cur.reps })
          dropQueued(localId)
          setLogs((prev) => prev.map((l) => (l.localId === localId ? { ...l, synced: true } : l)))
        } catch {
          if (cur) replaceQueued(cur)
        }
      }
    },

    deleteSet: async (localId) => {
      const cur = logs.find((l) => l.localId === localId)
      setLogs((prev) => prev.filter((l) => l.localId !== localId))
      dropQueued(localId)
      if (serverUp && cur?.id) {
        try { await api.deleteSet(cur.id) } catch {}
      }
    },

    setSettings: (patch) => {
      setSettingsState((s) => ({ ...s, ...patch }))
      if (serverUp && patch.displayName !== undefined) {
        api.saveProfile(patch.displayName).catch(() => {})
      }
    },
    setEquipment: (list) => setAvailableEquipment(list),

    // ---- split management (history is never deleted on switch) ----
    useSplit: async (splitId) => {
      setActiveSplitId(splitId)
    },

    customizeSplit: async (splitId) => {
      const src = getSplitById(splitId, customSplits)
      if (!src) throw new Error('Split not found.')
      if (src.isPersonalPreset || src.isPreset) {
        const copy = {
          ...JSON.parse(JSON.stringify(src)),
          id: `${src.id}-my-${Date.now()}`,
          name: `${src.name} — Custom`,
          category: 'Custom', isPreset: false, isPersonalPreset: false,
          badge: undefined
        }
        setCustomSplits((prev) => [copy, ...prev])
        setActiveSplitId(copy.id)
        await persistCustomSplit(copy, false)
        return copy.id
      }
      setActiveSplitId(src.id)
      return src.id
    },

    createCustomSplit: async ({ name, days }) => {
      const trainingDays = days.filter((d) => !d.isRestDay).length
      const split = {
        id: `custom-${Date.now()}`, name: name || 'My Custom Split',
        description: 'User-created custom split.', category: 'Custom',
        level: 'Custom', goals: [], tags: ['custom'],
        daysPerWeek: trainingDays, isPreset: false, isPersonalPreset: false, days
      }
      setCustomSplits((prev) => [split, ...prev])
      setActiveSplitId(split.id)
      await persistCustomSplit(split, false)
      return split.id
    },

    updateCustomSplit: async (splitId, patch) => {
      let updated = null
      setCustomSplits((prev) => prev.map((s) => {
        if (s.id !== splitId) return s
        updated = { ...s, ...patch }
        return updated
      }))
      if (updated) await persistCustomSplit(updated, true)
    },

    logsForDate: (yyyy_mm_dd) => logs.filter((l) => logIndiaDate(l) === yyyy_mm_dd),
    clearAllLocal: () => { setLogs([]); setSelections({}); localStorage.removeItem(LOG_KEY); localStorage.removeItem(SEL_KEY) },
    wipeLocalData: () => {
      for (const k of [SEL_KEY, LOG_KEY, SET_KEY, SPLIT_KEY, EQUIP_KEY, CUSTOM_KEY, SESS_KEY, SEQ_KEY]) {
        try { localStorage.removeItem(k) } catch {}
      }
      try { clearQueue() } catch {}
      setLogs([]); setSelections([]); setSessions({}); setSeqOverrides({})
      setSettingsState({ unit: 'kg', displayName: '' })
      setActiveSplitId('snake-split'); setAvailableEquipment(EQUIPMENT_LIST); setCustomSplits([])
    }
  }), [selections, logs, settings, syncMsg, online, user, demoMode, activeSplitId, activeSplit, availableEquipment, customSplits, sessions, seqOverrides])

  return <StoreCtx.Provider value={apiMem}>{children}</StoreCtx.Provider>
}

export function useStore() { return useContext(StoreCtx) }
