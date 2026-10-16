// Minimal JSON API client. Sessions live in an httpOnly cookie set by the
// server, so every request includes credentials. No database credentials,
// tokens, or secrets ever touch browser storage.
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'include',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : {},
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  let data = {};
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status}).`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),

  // Auth
  signup: (email, password) => request('/api/auth/signup', { method: 'POST', body: { email, password } }),
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: () => request('/api/auth/me'),
  resetRequest: (email) => request('/api/auth/reset-request', { method: 'POST', body: { email } }),
  resetConfirm: (token, password) => request('/api/auth/reset-confirm', { method: 'POST', body: { token, password } }),
  changePassword: (currentPassword, newPassword) =>
    request('/api/auth/password', { method: 'POST', body: { currentPassword, newPassword } }),

  // App data
  profile: () => request('/api/profile'),
  saveProfile: (displayName) => request('/api/profile', { method: 'PATCH', body: { displayName } }),
  preferences: () => request('/api/preferences'),
  savePreferences: (patch) => request('/api/preferences', { method: 'PUT', body: patch }),
  days: () => request('/api/days'),
  selections: () => request('/api/selections'),
  setSelection: (muscle, rank) => request('/api/selections', { method: 'POST', body: { muscle, rank } }),
  logs: (params = {}) => {
    const q = new URLSearchParams();
    if (params.from) q.set('from', params.from);
    if (params.to) q.set('to', params.to);
    if (params.limit) q.set('limit', params.limit);
    const s = q.toString();
    return request(`/api/logs${s ? `?${s}` : ''}`);
  },
  logSet: (entry) => request('/api/logs', { method: 'POST', body: entry }),
  editSet: (id, patch) => request(`/api/logs/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch }),
  deleteSet: (id) => request(`/api/logs/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  setSessionStatus: (payload) => request('/api/sessions', { method: 'PATCH', body: payload }),
  splits: () => request('/api/splits'),
  createSplit: (payload) => request('/api/splits', { method: 'POST', body: payload }),
  updateSplit: (id, payload) => request(`/api/splits/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
  leaderboard: () => request('/api/leaderboard'),
  deleteAccount: () => request('/api/account', { method: 'DELETE' }),
  health: () => request('/api/health'),

  // Admin API — authorization is enforced again on every server request.
  adminDashboard: () => request('/api/admin/dashboard'),
  adminUsers: (params = {}) => request(`/api/admin/users?${new URLSearchParams(params)}`),
  adminUser: (id) => request(`/api/admin/users/${encodeURIComponent(id)}`),
  adminEditUser: (id, body) => request(`/api/admin/users/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  adminSetStatus: (id, status) => request(`/api/admin/users/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: { status } }),
  adminDeleteUser: (id) => request(`/api/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  adminWorkouts: (params = {}) => request(`/api/admin/workouts?${new URLSearchParams(params)}`),
  adminMuscles: (params = {}) => request(`/api/admin/muscles?${new URLSearchParams(params)}`),
  adminDatabase: () => request('/api/admin/database'),
  adminAuditLogs: (params = {}) => request(`/api/admin/audit-logs?${new URLSearchParams(params)}`),
  adminChangeRole: (userId, role) => request('/api/admin/roles', { method: 'PATCH', body: { userId, role } })
  ,adminLogin: (username, password) => request('/api/admin/auth/login', { method: 'POST', body: { username, password } })
  ,adminLogout: () => request('/api/admin/auth/logout', { method: 'POST' })
  ,adminSession: () => request('/api/admin/auth/session')
};

export async function backendReady() {
  try { await api.health(); return true; } catch { return false; }
}
