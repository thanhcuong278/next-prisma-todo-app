"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      router.push("/api/auth/signin");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm w-80 space-y-4"
      >
        <h1 className="text-lg font-semibold text-center">Sign Up</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
