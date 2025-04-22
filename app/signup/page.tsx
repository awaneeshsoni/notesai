'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else router.push('/notes');
  };

  const handleSignInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/notes`, //  Ensure correct redirect after sign-in
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0">
      <div className="max-w-md w-full mx-auto mt-20 space-y-6 p-6 sm:p-8 border rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>

        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-3">
          <Button className="w-full" onClick={handleSignup}>
            Sign Up
          </Button>
          <Button className="w-full" variant="outline" onClick={handleSignInWithGoogle}>
            Sign Up with Google
          </Button>
        </div>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
