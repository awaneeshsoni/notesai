"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import Link from 'next/link';
import { RotateCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push('/notes');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoggingIn(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/notes`,
        },
      });
      if (error) setError(error.message);
    } finally {
      setIsGoogleLoggingIn(false);
    }
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

          <Button onClick={handleLogin} className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                Logging in... <RotateCw className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              'Login'
            )}
          </Button>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full"
            disabled={isGoogleLoggingIn}
          >
            {isGoogleLoggingIn ? (
              <>
                Logging in with Google... <RotateCw className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              'Continue with Google'
            )}
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