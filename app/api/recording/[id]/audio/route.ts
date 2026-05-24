import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const { data: recording } = await supabase
    .from('recordings')
    .select('storage_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!recording) return Response.json({ error: { code: 'NOT_FOUND' } }, { status: 404 });

  const { data: signed, error } = await supabase.storage
    .from('recordings')
    .createSignedUrl(recording.storage_path, 900);

  if (error || !signed) {
    return Response.json({ error: { code: 'SERVER_ERROR' } }, { status: 500 });
  }

  return Response.json({ data: { url: signed.signedUrl } });
}
