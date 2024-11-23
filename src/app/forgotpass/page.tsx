'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import NavBar from '@/components/NavBar'
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY || ""
);

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const securityQuestions = [
    "What is the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your elementary school?",
    "What was the make of your first car?",
    "In what city were you born?"
  ];

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // Check if the user exists and verify the security question answer
    const { data, error: userError } = await supabase
      .from('users')
      .select('email, security_question, security_answer')
      .eq('username', username)
      .single();

    if (userError || !data) {
      setError('No account found with this username.');
      setIsLoading(false);
      return;
    }

    // Check if the email matches
    if (data.email !== email) {
      setError('Email does not match the account associated with this username.');
      setIsLoading(false);
      return;
    }

    // Check if the security question and answer match
    if (data.security_question !== securityQuestion || data.security_answer !== securityAnswer) {
      setError('Security question answer is incorrect.');
      setIsLoading(false);
      return;
    }

    // Allow the user to reset the password
    // You can either send a password reset link or allow the reset here directly
    // Here we'll redirect to a reset page
    router.push(`/reset-password?username=${username}`);
    setIsLoading(false);
  }

  return (
    <>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <NavBar isMobile={false} hideButton />
        <Card className="w-[380px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your username, email, and answer the security question to reset your password
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
                />
              </div>
              <div className="grid gap-2 mt-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2 mt-3">
                <Label htmlFor="securityQuestion">Security Question</Label>
                <select
                  id="securityQuestion"
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a security question</option>
                  {securityQuestions.map((question, index) => (
                    <option key={index} value={question}>{question}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 mt-3">
                <Label htmlFor="securityAnswer">Answer</Label>
                <Input
                  id="securityAnswer"
                  type="text"
                  placeholder="Your answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                />
              </div>
              <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify and Reset Password"}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Remembered your password?{' '}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
