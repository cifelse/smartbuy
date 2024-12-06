'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY || ""
);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login"); // Redirect if not logged in
        return;
      }

      const { data: userInfo } = await supabase
        .from("users")
        .select("username, email, first_name, last_name")
        .eq("id", data.user.id)
        .single();

      setUser(userInfo || null);
    };

    fetchUser();
  }, [router]);

  const handlePasswordUpdate = async () => {
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 12 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[@$!%*?&]/.test(password)) {
      setError(
        "Password must be at least 12 characters long, and include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Failed to update password. Try again later.");
    } else {
      setSuccess("Password updated successfully!");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <ShoppingBag className="h-6 w-6 mr-2" />
              <h1 className="text-2xl font-bold">SmartBuy</h1>
            </div>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">Logout</Button>
          </Link>
        </div>
      </header>

      {/* Profile Content */}
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-800">User Profile</h2>
            <p className="text-gray-600 text-sm">Manage your account details and password.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {user ? (
              <>
                {/* User Details */}
                <div>
                  <Label>Username</Label>
                  <p className="text-gray-800">{user.username}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <p className="text-gray-800">{user.first_name}</p>
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <p className="text-gray-800">{user.last_name}</p>
                  </div>
                </div>
                <hr />

                {/* Password Update */}
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-500">{success}</p>}
                <Button
                  className="w-full"
                  onClick={handlePasswordUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
