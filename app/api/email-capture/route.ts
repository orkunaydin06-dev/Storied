import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const schema = z.object({
  email: z.string().email(),
});

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_INPUT', message: 'Invalid JSON.' } },
      { status: 400 }
    );
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_INPUT', message: 'Valid email required.' } },
      { status: 400 }
    );
  }

  const { email } = result.data;
  const supabase = getServiceClient();

  const { error } = await supabase
    .from('email_subscribers')
    .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true });

  if (error) {
    console.error('Email capture error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Could not save email.' } },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { data: { message: 'Subscribed.' } },
    { status: 201 }
  );
}
