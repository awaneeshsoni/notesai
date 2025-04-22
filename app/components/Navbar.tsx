'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { Button } from "../components/ui/button";

const Navbar = () => {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
    });
  }, [router]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    } else {
      router.push('/login');
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex items-center justify-between">
      <a href="/" className="text-lg font-bold">
        Notes AI
      </a>

      {session ? (
        <div>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;