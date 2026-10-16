import { getSql } from './_lib/db.mjs';
import { json, method, readBody } from './_lib/http.mjs';
import { requireUser } from './_lib/auth.mjs';

// GET -> presets + own customs with days + muscle targets (template shape).
// POST { name, description?, days: [{ dayOfWeek, name, isRestDay, muscles: [{muscle, priority}] }] } -> { split }
export default async function handler(req, res) {
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const sql = await getSql();

    async function fullSplit(id) {
      const s = await sql`select * from workout_splits where id = ${id} and (is_preset = true or user_id = ${user.id}) limit 1`;
      if (!s.length) return null;
      const split = s[0];
      const days = await sql`select * from split_days where split_id = ${id} order by order_index`;
      const out = [];
      for (const d of days) {
        const tg = await sql`select muscle_name, priority from split_muscle_targets where split_day_id = ${d.id} order by priority`;
        out.push({
          dayOfWeek: d.day_of_week, name: d.name, isRestDay: d.is_rest_day,
          muscles: tg.map((t) => ({ muscle: t.muscle_name, priority: t.priority }))
        });
      }
      return {
        id: split.id, name: split.name, description: split.description, category: split.category,
        level: split.level, goals: split.goals, tags: split.tags, daysPerWeek: split.days_per_week,
        isPreset: split.is_preset, isPersonalPreset: split.is_personal_preset, isImmutable: split.is_immutable,
        days: out
      };
    }

    if (req.method === 'GET') {
      const all = await sql`select id from workout_splits
        where is_preset = true or user_id = ${user.id} order by is_preset desc, name`;
      const splits = [];
      for (const r of all) {
        const full = await fullSplit(r.id);
        if (full) splits.push(full);
      }
      return json(res, 200, { splits });
    }
    if (!method(req, res, ['POST'])) return;
    const { name, description, days, level, goals, tags } = await readBody(req);
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) {
      return json(res, 400, { error: 'Split name must be 1–80 characters.' });
    }
    if (!Array.isArray(days) || !days.length || days.length > 7) {
      return json(res, 400, { error: 'Provide 1–7 days.' });
    }
    const id = `custom-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const training = days.filter((d) => !d.isRestDay).length;
    await sql`insert into workout_splits (id, user_id, name, description, category, level, goals, tags, days_per_week, is_preset, is_personal_preset, is_immutable)
      values (${id}, ${user.id}, ${name.trim()}, ${String(description || '').slice(0, 500)}, 'Custom',
        ${String(level || 'Custom').slice(0, 40)}, ${Array.isArray(goals) ? goals.filter((g) => typeof g === 'string').slice(0, 10) : []},
        ${Array.isArray(tags) ? tags.filter((g) => typeof g === 'string').slice(0, 10) : ['custom']},
        ${training}, false, false, false)`;
    let i = 0;
    for (const d of days) {
      const dd = await sql`insert into split_days (split_id, day_of_week, name, is_rest_day, order_index)
        values (${id}, ${d.dayOfWeek}, ${String(d.name || '').slice(0, 80)}, ${!!d.isRestDay}, ${i++})
        returning id`;
      if (!d.isRestDay && Array.isArray(d.muscles)) {
        for (const t of d.muscles.slice(0, 45)) {
          if (typeof t.muscle !== 'string') continue;
          await sql`insert into split_muscle_targets (split_day_id, muscle_name, priority)
            values (${dd[0].id}, ${t.muscle.slice(0, 80)}, ${Number(t.priority) || 1})
            on conflict (split_day_id, muscle_name) do update set priority = excluded.priority`;
        }
      }
    }
    return json(res, 201, { split: await fullSplit(id) });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Split request failed.' });
  }
}
