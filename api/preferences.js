import { getSql } from './_lib/db.mjs';
import { json, method, readBody } from './_lib/http.mjs';
import { requireUser } from './_lib/auth.mjs';

// GET -> { preferences } | PUT { activeSplitId, weightUnit, availableEquipment }
export default async function handler(req, res) {
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const sql = await getSql();
    if (req.method === 'GET') {
      const rows = await sql`select active_split_id, weight_unit, available_equipment from user_preferences where user_id = ${user.id} limit 1`;
      return json(res, 200, { preferences: rows[0] || null });
    }
    if (!method(req, res, ['PUT'])) return;
    const { activeSplitId, weightUnit, availableEquipment } = await readBody(req);
    if (activeSplitId !== undefined && activeSplitId !== null && typeof activeSplitId !== 'string') {
      return json(res, 400, { error: 'Invalid split.' });
    }
    if (activeSplitId) {
      const ok = await sql`select id from workout_splits
        where id = ${activeSplitId} and (is_preset = true or user_id = ${user.id}) limit 1`;
      if (!ok.length) return json(res, 404, { error: 'Split not found.' });
    }
    const unit = weightUnit === 'lb' ? 'lb' : 'kg';
    const equip = Array.isArray(availableEquipment)
      ? availableEquipment.filter((x) => typeof x === 'string').slice(0, 100) : undefined;
    const rows = await sql`insert into user_preferences (user_id, active_split_id, weight_unit, available_equipment, updated_at)
      values (${user.id}, ${activeSplitId || null}, ${unit}, ${equip === undefined ? '{}' : equip})
      on conflict (user_id) do update set
        active_split_id = coalesce(excluded.active_split_id, user_preferences.active_split_id),
        weight_unit = excluded.weight_unit,
        available_equipment = case when ${equip === undefined} then user_preferences.available_equipment else excluded.available_equipment end,
        updated_at = now()
      returning active_split_id, weight_unit, available_equipment`;
    return json(res, 200, { preferences: rows[0] });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Preferences request failed.' });
  }
}
