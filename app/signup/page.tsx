'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const handleSignup = async () => {
    setError(null);
    setIsLoadingSignup(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setIsLoadingSignup(false);
    if (error) setError(error.message);
    else router.push('/notes');
  };

  const handleSignInWithGoogle = async () => {
    setError(null);
    setIsLoadingGoogle(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/notes`, 
      },
    });
    setIsLoadingGoogle(false);
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
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button onClick={handleSignup} disabled={isLoadingSignup} className="w-full">
            {isLoadingSignup ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sign Up
          </Button>

          <Button onClick={handleSignInWithGoogle} disabled={isLoadingGoogle} className="w-full" variant="outline">
            {isLoadingGoogle ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sign Up with Google
          </Button>

          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
