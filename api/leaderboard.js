import { getSql } from './_lib/db.mjs';
import { json, method, query } from './_lib/http.mjs';
import { requireUser } from './_lib/auth.mjs';

// Public leaderboard: display_name ONLY plus aggregates computed from logs.
// Never exposes emails, user ids, or private workout details.
// Scoring rewards consistency + completed sessions + volume + coverage + streak.
export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  try {
    const sql = await getSql();
    const q = query(req);
    const limit = Math.min(50, Math.max(5, Number(q.get('limit')) || 25));
    let meId = null;
    try {
      const me = await requireUser(req);
      if (me) meId = me.id;
    } catch { /* public endpoint stays public */ }

    const rows = await sql`
      with per_user as (
        select l.user_id,
          count(*)::int as total_sets,
          coalesce(sum(l.weight * l.reps_completed), 0)::float as total_volume,
          count(distinct l.workout_date)::int as training_days,
          count(distinct (l.workout_date, l.workout_day, l.split_id))::int as sessions,
          count(distinct l.muscle_name)::int as muscles_trained
        from (
          select l.user_id, l.weight, l.reps_completed, l.workout_date, l.workout_day, l.split_id,
            coalesce(mc.muscle_name, e.muscle) as muscle_name
          from workout_logs l
          join exercises e on e.id = l.exercise_id
          left join muscle_coverage mc on mc.workout_log_id = l.id and mc.coverage_type = 'primary'
          where l.completed = true
        ) l
        group by l.user_id
      ),
      recent as (
        select user_id, count(distinct workout_date)::int as days_28
        from workout_logs
        where completed = true and workout_date >= current_date - interval '28 days'
        group by user_id
      ),
      islands as (
        select user_id, grp, count(*)::int as len, max(workout_date) as island_end
        from (
          select user_id, workout_date,
            workout_date - row_number() over (partition by user_id order by workout_date desc)::int as grp
          from (select distinct user_id, workout_date from workout_logs where completed = true) d
        ) g
        group by user_id, grp
      ),
      streaks as (
        select user_id, max(len)::int as current_streak
        from islands
        where island_end >= current_date - interval '1 day'
        group by user_id
      ),
      scored as (
        select u.user_id,
          coalesce(r.days_28, 0) as days_28,
          u.sessions as total_workouts,
          u.total_volume,
          u.muscles_trained,
          coalesce(s.current_streak, 0) as current_streak,
          (
            coalesce(r.days_28, 0) * 10
            + least(u.sessions, 200)
            + least(u.total_volume / 1000.0, 200)
            + u.muscles_trained * 5
            + coalesce(s.current_streak, 0) * 4
          ) as overall_score
        from per_user u
        left join recent r on r.user_id = u.user_id
        left join streaks s on s.user_id = u.user_id
      ),
      ranked as (
        select sc.*,
          row_number() over (order by sc.overall_score desc) as rank,
          count(*) over () as lifters
        from scored sc
      )
      select p.display_name, r.total_workouts, r.total_volume, r.days_28,
        r.muscles_trained, r.current_streak, r.overall_score, r.rank, r.lifters,
        (r.user_id = ${meId}::uuid) as is_me
      from ranked r
      join profiles p on p.id = r.user_id
      where r.rank <= ${limit} or r.user_id = ${meId}::uuid
      order by r.rank`;

    const leaderboard = rows.map((r) => ({
      rank: Number(r.rank),
      displayName: r.display_name || 'Lifter',
      overallScore: Math.round(Number(r.overall_score)),
      totalWorkouts: r.total_workouts,
      totalVolume: Math.round(Number(r.total_volume)),
      currentStreak: r.current_streak,
      muscleCoverageScore: r.muscles_trained,
      consistency: r.days_28,
      isMe: !!r.is_me
    }));
    const lifters = rows.length ? Number(rows[0].lifters) : 0;
    return json(res, 200, { leaderboard, lifters });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Leaderboard unavailable.' });
  }
}
