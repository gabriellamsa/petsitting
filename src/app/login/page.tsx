"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email.trim()) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        setSubmitted(true);
      } catch (error: any) {
        setError(error.message);
        console.error("Error sending magic link:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white text-center">
        {!submitted ? (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
              Sign in
            </h1>
            <p className="text-gray-700 mt-2 mb-6">
              Welcome back! We were hoping we'd see you again…
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <input
                type="email"
                required
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-gray-200 text-gray-500 py-2 rounded-md text-sm font-semibold"
              >
                Continue
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6 text-left">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              Check your email
            </h2>
            <p className="text-center text-gray-700 text-sm">
              A sign-in link has been sent to <strong>{email}</strong>.
              <br />
              Click the link in your inbox to log in.
            </p>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="text-sm text-gray-700 hover:underline"
              >
                Use a different email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
