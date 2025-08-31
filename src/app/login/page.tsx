"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      localStorage.setItem("token", data.token);

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('Login successful', data);
      setLoading(false);
      setMessage("Login successful");
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (error: any) {
      console.log('Login error', error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Login Page</h1>
      <div className="w-full max-w-sm space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password" // ✅ fix: correct input type
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // ✅ fix: update state
        />
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="flex justify-between items-center">
        <p>Don't have an account?</p>
        <Link href='/register'><p className="text-green-500 font-bold">Register</p></Link>
        </div>
        {message && <p className="text-green-600">{message}</p>}
      </div>
    </div>
  )
}