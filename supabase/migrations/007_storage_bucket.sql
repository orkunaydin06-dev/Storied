-- Private storage bucket for user recordings
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recordings',
  'recordings',
  false,
  52428800, -- 50MB max
  array['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/mpeg']
)
on conflict (id) do nothing;

-- RLS for storage: users can only access their own recordings
create policy "Users can upload their own recordings"
  on storage.objects for insert
  with check (
    bucket_id = 'recordings' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can read their own recordings"
  on storage.objects for select
  using (
    bucket_id = 'recordings' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own recordings"
  on storage.objects for delete
  using (
    bucket_id = 'recordings' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Seed/dev note: Run this SQL in Supabase dashboard → SQL editor
-- The storage bucket policies use the user's UUID as the top-level folder
-- e.g., recordings/{user-uuid}/day-01/recording-1.webm
