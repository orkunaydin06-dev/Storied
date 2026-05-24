create or replace function get_user_practice_status(p_user_id uuid)
returns table (
  current_day integer,
  total_recordings integer,
  streak_days integer,
  last_practice_date date,
  is_today_complete boolean
)
language sql
security definer
as $$
  select
    u.current_day,
    (select count(*)::integer from public.recordings where user_id = p_user_id and feedback_status = 'ready') as total_recordings,
    u.streak_days,
    u.last_practice_date,
    (u.last_practice_date = current_date) as is_today_complete
  from public.users u
  where u.id = p_user_id;
$$;
