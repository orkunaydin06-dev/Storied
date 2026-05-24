create table public.recordings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,

  -- Identity
  day_number integer not null,
  recording_number integer not null,

  -- Storage
  storage_path text not null,
  duration_seconds numeric(5,2) not null,
  file_size_bytes integer not null,
  mime_type text not null,

  -- Transcription
  transcript text,
  transcript_language text default 'en',
  transcript_word_count integer,
  word_timestamps jsonb,
  transcription_completed_at timestamptz,

  -- Waveform
  waveform_peaks integer[],

  -- Status
  upload_status text default 'pending',
  feedback_status text default 'pending',
  edge_case_type text,

  -- Timestamps
  created_at timestamptz default now(),

  -- Constraints
  constraint valid_day_number check (day_number between 1 and 30),
  constraint valid_recording_number check (recording_number in (1, 2)),
  unique (user_id, day_number, recording_number)
);

create index idx_recordings_user_id on public.recordings(user_id);
create index idx_recordings_user_day on public.recordings(user_id, day_number);

alter table public.recordings enable row level security;

create policy "Users can read their own recordings"
  on public.recordings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own recordings"
  on public.recordings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own recordings"
  on public.recordings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own recordings"
  on public.recordings for delete
  using (auth.uid() = user_id);
