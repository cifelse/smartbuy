'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Icons } from "@/components/ui/icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import NavBar from '@/components/NavBar'

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      router.push('/')
    }, 3000)
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
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="johndoe" />
              </div>
              <div className="grid gap-2 mt-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                {isLoading && (
                  // <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  true
                )}
                Sign In
              </Button>
            </form>

            <div className="relative mt-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}