import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('notes').select('*');
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req: Request) {
  const { title, content } = await req.json();
  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, content, user_id: (await supabase.auth.getSession()).data.session.user.id }]);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify(data), { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const { data, error } = await supabase.from('notes').delete().eq('id', id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function PUT(req: Request) {
  const { id, title, content } = await req.json();
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify(data), { status: 200 });
}
