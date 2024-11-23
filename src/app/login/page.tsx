'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import NavBar from '@/components/NavBar'
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"; // Import bcrypt for hashing

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY || ""
);

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const router = useRouter();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 300000; // 5 minutes in milliseconds

  // Handle account lockout timer
  useEffect(() => {
    if (lockoutTime) {
      const timer = setInterval(() => {
        if (Date.now() >= lockoutTime) {
          setLockoutTime(null);
          setLoginAttempts(0);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // Check lockout state
    if (lockoutTime && Date.now() < lockoutTime) {
      setIsLoading(false);
      setError(`Account locked. Try again after ${Math.ceil((lockoutTime - Date.now()) / 1000)} seconds.`);
      return;
    }

    // Authenticate with Supabase
    const { data, error: authError } = await supabase
      .from('users')
      .select('password, last_login')
      .eq('username', username)
      .single();

    if (authError || !data || !(await bcrypt.compare(password, data.password))) {
      setLoginAttempts((prev) => prev + 1);

      if (loginAttempts + 1 >= MAX_ATTEMPTS) {
        setLockoutTime(Date.now() + LOCKOUT_DURATION);
        setError("Too many invalid login attempts. Account locked for 5 minutes.");
      } else {
        setError("Invalid username and/or password.");
      }

      setIsLoading(false);
      return;
    }

    // Successful login
    setLoginAttempts(0);
    setError('');
    const lastLogin = data.last_login;

    // Update last_login timestamp
    await supabase.from('users').update({ last_login: new Date() }).eq('username', username);

    setIsLoading(false);
    alert(`Welcome back! Last login was: ${lastLogin ? new Date(lastLogin).toLocaleString() : "First time login."}`);
    router.push('/');
  }

  return (
    <>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <NavBar isMobile={false} hideButton />
        <Card className="w-[380px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Enter your username and password to sign in
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <form onSubmit={onSubmit}>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!!lockoutTime}
                />
              </div>
              <div className="grid gap-2 mt-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!!lockoutTime}
                />
              </div>
              <Button className="w-full mt-4" type="submit" disabled={isLoading || !!lockoutTime}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-sm text-muted-foreground">
            <Link href="/forgotpass" className="underline">
              Forgot Password?
              </Link>
              <br></br>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
