-- Dynamis Tracker — DEMO DATA for the test account ONLY.
-- Replace <TEST_USER_ID> with the UUID from Authentication → Users.
-- Never run this for real users. Every row is marked notes = 'DEMO DATA'.
-- Run AFTER schema.sql + migration_splits.sql + seed.sql + seed_splits.sql.

-- ============ demo sets: one completed day, one partial day, scattered sets ============
create temp table demo_sets (
  muscle text, rank text, weight numeric, reps int, day_offset int, set_no int
) on commit drop;

-- Completed day (CURRENT_DATE - 6): Lower + Core style, 9 muscles x 3 sets
insert into demo_sets values
 ('Quadriceps','best',60,12,6,1),('Quadriceps','best',60,10,6,2),('Quadriceps','best',62.5,10,6,3),
 ('Rectus femoris','best',25,12,6,1),('Rectus femoris','best',25,12,6,2),('Rectus femoris','best',27.5,10,6,3),
 ('Adductors','best',40,15,6,1),('Adductors','best',40,15,6,2),('Adductors','best',45,12,6,3),
 ('Calves','best',55,20,6,1),('Calves','best',55,18,6,2),('Calves','best',60,15,6,3),
 ('Tibialis anterior','best',5,20,6,1),('Tibialis anterior','best',5,20,6,2),('Tibialis anterior','best',7.5,15,6,3),
 ('Tensor fasciae latae','best',20,15,6,1),('Tensor fasciae latae','best',20,15,6,2),('Tensor fasciae latae','best',22.5,12,6,3),
 ('Iliopsoas','best',15,12,6,1),('Iliopsoas','best',15,12,6,2),('Iliopsoas','best',17.5,10,6,3),
 ('Rectus abdominis','best',20,15,6,1),('Rectus abdominis','best',20,15,6,2),('Rectus abdominis','best',25,12,6,3),
 ('External obliques','best',15,15,6,1),('External obliques','best',15,15,6,2),('External obliques','best',17.5,12,6,3),
-- Partial day (CURRENT_DATE - 3): 3 muscles x 2 sets
 ('Latissimus dorsi','best',50,10,3,1),('Latissimus dorsi','best',50,8,3,2),
 ('Biceps brachii','best',15,12,3,1),('Biceps brachii','best',15,10,3,2),
 ('Posterior deltoid','best',10,15,3,1),('Posterior deltoid','best',10,12,3,2),
-- Scattered sets (CURRENT_DATE - 1)
 ('Pectoralis major','best',50,10,1,1),('Pectoralis major','best',50,8,1,2),
 ('Triceps brachii','best',25,12,1,1),('Triceps brachii','best',25,10,1,2);

insert into public.workout_logs
  (user_id, exercise_id, performed_at, reps_completed, weight, sets_completed,
   notes, completed, workout_date, split_id, split_name)
select
  '<TEST_USER_ID>', e.id,
  ((current_date - d.day_offset) + time '07:30+05:30' + (d.set_no || ' minutes')::interval),
  d.reps, d.weight, 1,
  'DEMO DATA', true,
  (current_date - d.day_offset), 'snake-split', 'Snake''s Split'
from demo_sets d
join public.exercises e on e.muscle = d.muscle and e.rank = d.rank;

-- ============ sessions (one row per demo day, keeps its split name) ============
insert into public.workout_sessions (user_id, date, split_id, split_name)
select '<TEST_USER_ID>', current_date - n, 'snake-split', 'Snake''s Split'
from (select distinct day_offset as n from demo_sets) s
on conflict (user_id, date) do update set split_name = excluded.split_name;

-- ============ coverage backfill for demo logs only ============
insert into public.muscle_coverage (user_id, workout_log_id, muscle_name, coverage_type, coverage_date)
select l.user_id, l.id, m, 'primary', l.workout_date
from public.workout_logs l
join public.exercises e on e.id = l.exercise_id,
lateral unnest(e.primary_muscles) as m
where l.user_id = '<TEST_USER_ID>' and l.notes = 'DEMO DATA'
  and not exists (select 1 from public.muscle_coverage c where c.workout_log_id = l.id and c.coverage_type = 'primary');

insert into public.muscle_coverage (user_id, workout_log_id, muscle_name, coverage_type, coverage_date)
select l.user_id, l.id, m, 'secondary', l.workout_date
from public.workout_logs l
join public.exercises e on e.id = l.exercise_id,
lateral unnest(e.secondary_muscles) as m
where l.user_id = '<TEST_USER_ID>' and l.notes = 'DEMO DATA'
  and not exists (select 1 from public.muscle_coverage c where c.workout_log_id = l.id and c.coverage_type = 'secondary');

insert into public.muscle_coverage (user_id, workout_log_id, muscle_name, coverage_type, coverage_date)
select l.user_id, l.id, m, 'stabilizer', l.workout_date
from public.workout_logs l
join public.exercises e on e.id = l.exercise_id,
lateral unnest(e.stabilizer_muscles) as m
where l.user_id = '<TEST_USER_ID>' and l.notes = 'DEMO DATA'
  and not exists (select 1 from public.muscle_coverage c where c.workout_log_id = l.id and c.coverage_type = 'stabilizer');
