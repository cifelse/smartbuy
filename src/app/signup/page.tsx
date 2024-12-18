'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import NavBar from '@/components/NavBar'
import bcrypt from 'bcryptjs' // Import bcrypt

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY || ""
);

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const validatePassword = (password: string): boolean => {
    const minLength = 9;
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    return password.length >= minLength && complexityRegex.test(password);
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const { username, email, firstName, lastName, password, confirmPassword, securityQuestion, securityAnswer } = formData;

    // Basic validations
    if (!validatePassword(password)) {
      setError('Password must be at least 9 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (!securityQuestion || !securityAnswer.trim()) {
      setError('Please select a security question and provide an answer.');
      setIsLoading(false);
      return;
    }

    try {
      // Hash the password and security answer
      const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt to hash the password
      const hashedAnswer = await bcrypt.hash(securityAnswer, 10); // Use bcrypt to hash the security answer

      // Save to Supabase
      const { error: supabaseError } = await supabase.from('users').insert({
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword, // Store the hashed password
        security_question: securityQuestion,
        security_answer: hashedAnswer, // Store the hashed security answer
      });

      if (supabaseError) {
        console.error('Supabase error:', supabaseError); // Log specific Supabase error
        setError('Error saving user data. Please try again later.');
        setIsLoading(false);
        return;
      }

      // Navigate to success or login page
      setIsLoading(false);
      router.push('/login');
    } catch (err) {
      // Log more detailed error information
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-gray-50">
      <NavBar isMobile={false} hideButton />
      <Card className="w-[400px] shadow-md border border-gray-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Input Fields */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="johndoe" onChange={handleInputChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" onChange={handleInputChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" type="text" placeholder="John" onChange={handleInputChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" type="text" placeholder="Doe" onChange={handleInputChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" onChange={handleInputChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" onChange={handleInputChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="securityQuestion">Security Question</Label>
              <select id="securityQuestion" className="p-2 border rounded w-full" value={formData.securityQuestion} onChange={handleInputChange} required>
                <option value="" disabled>Select a security question</option>
                <option value="birth_city">In what city were you born?</option>
                <option value="first_school">What was the name of your first school?</option>
                <option value="first_job">What was the title of your first job?</option>
                <option value="first_phone">What was the brand of your first mobile phone?</option>
                <option value="first_roommate">What is the first name of your first roommate?</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="securityAnswer">Answer</Label>
              <Input id="securityAnswer" type="text" placeholder="Answer to the question" onChange={handleInputChange} required />
            </div>
            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {/* Submit Button */}
            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="underline">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
