'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import NavBar from '@/components/NavBar'

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

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    // Simulate backend processing
    setTimeout(() => {
      setIsLoading(false)
      router.push('/')
    }, 3000)
  }

  return (
    <>
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
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  className="w-full"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="w-full"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="w-full"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="w-full"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="w-full"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="w-full"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="securityQuestion">Security Question</Label>
                <select
                  id="securityQuestion"
                  className="p-2 border rounded w-full"
                  value={formData.securityQuestion}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select a security question
                  </option>
                  <option value="birth_city">In what city were you born?</option>
                  <option value="first_school">What was the name of your first school?</option>
                  <option value="first_job">What was the title of your first job?</option>
                  <option value="first_phone">What was the brand of your first mobile phone?</option>
                  <option value="first_roommate">What is the first name of your first roommate?</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="securityAnswer">Answer</Label>
                <Input
                  id="securityAnswer"
                  type="text"
                  placeholder="Answer to the question"
                  className="w-full"
                  onChange={handleInputChange}
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                By signing up, you agree to our{' '}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="/terms" className="underline">
                  Terms of Service.
                </Link>
              </p>
              <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
