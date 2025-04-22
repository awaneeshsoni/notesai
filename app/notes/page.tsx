'use client';

import { useEffect, useState } from 'react';
import { Note } from 'types';
import { supabase } from '../lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import NoteCard from '../components/NoteCard';
import { Button } from "../components/ui/button";

async function getNotes(userId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Note[];
}

export default function NotesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUserId(session.user.id);
    };

    fetchSession();
  }, [router]);

  const { data: notes, isLoading, isError, error } = useQuery({
    queryKey: ['notes', userId],
    queryFn: () => getNotes(userId!),
    enabled: !!userId,
  });

  if (!userId) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error?.message}</div>;
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-4xl mx-auto mt-10 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Your Notes</h1>
          <Button onClick={() => router.push('/create')}>Create Note</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes?.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    </div>
  );
}
