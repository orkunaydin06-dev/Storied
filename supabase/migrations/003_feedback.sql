create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  recording_id uuid references public.recordings(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,

  -- Scores (0-100)
  score_clarity integer not null,
  score_structure integer not null,
  score_delivery integer not null,
  score_depth integer not null,
  score_impact integer not null,
  score_authenticity integer not null,
  score_overall integer not null,

  -- Narrative content
  narrative text not null,
  structure_breakdown jsonb,
  carry_forward text,
  tomorrow_preview text,

  -- Day 30 graduation
  graduation_narrative text,
  what_changed_most text,
  what_stayed_strongest text,

  -- Metadata
  model_used text not null,
  prompt_version text not null,

  -- Timestamps
  generated_at timestamptz default now(),

  -- Constraints
  constraint valid_score_clarity check (score_clarity between 0 and 100),
  constraint valid_score_structure check (score_structure between 0 and 100),
  constraint valid_score_delivery check (score_delivery between 0 and 100),
  constraint valid_score_depth check (score_depth between 0 and 100),
  constraint valid_score_impact check (score_impact between 0 and 100),
  constraint valid_score_authenticity check (score_authenticity between 0 and 100),
  constraint valid_score_overall check (score_overall between 0 and 100),

  unique (recording_id)
);

create index idx_feedback_user_id on public.feedback(user_id);
create index idx_feedback_recording_id on public.feedback(recording_id);

alter table public.feedback enable row level security;

create policy "Users can read their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);
