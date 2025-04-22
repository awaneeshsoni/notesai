'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { Button } from "../components/ui/button";
import { RotateCw } from "lucide-react";

const Navbar = () => {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

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
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
      } else {
        router.push('/login');
      }
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-black p-4 text-white flex items-center justify-between">
      <a href="/" className="text-lg font-bold text-white">
        Notes AI
      </a>

      {session ? (
        <div>
          <Button onClick={handleSignOut} disabled={isSigningOut} variant="secondary" className="bg-white text-black hover:bg-gray-100">
            {isSigningOut ? (
              <>
                Signing Out... <RotateCw className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Sign Out"
            )}
          </Button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;