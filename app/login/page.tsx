'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/notes');
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/notes`,
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0">
      <div className="max-w-md w-full mx-auto mt-20 space-y-6 p-6 sm:p-8 border rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>

          <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
            Continue with Google
          </Button>

          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
