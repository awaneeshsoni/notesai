import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = cookies();
  
  // Create a Supabase client with custom cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Get the session
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect based on the session state
  if (session) {
    return redirect('/notes');
  } else {
    return redirect('/login');
  }
}
