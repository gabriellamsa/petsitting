"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [actionCodeSettings, setActionCodeSettings] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActionCodeSettings({
        url: window.location.origin + "/login",
        handleCodeInApp: true,
      });
    }
  }, []);

  useEffect(() => {
    const checkSignInLink = async () => {
      if (
        typeof window !== "undefined" &&
        isSignInWithEmailLink(auth, window.location.href)
      ) {
        const storedEmail = window.localStorage.getItem("emailForSignIn");
        if (storedEmail) {
          try {
            await signInWithEmailLink(auth, storedEmail, window.location.href);
            localStorage.removeItem("emailForSignIn");
            window.location.href = "/";
          } catch (error) {
            console.error("Sign-in error:", error);
            setStep("email");
          }
        }
      }
    };

    checkSignInLink();
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && actionCodeSettings) {
      try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem("emailForSignIn", email);
        setSubmitted(true);
        setStep("code");
      } catch (error) {
        console.error("Error sending email link:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white text-center">
        {step === "email" ? (
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
                  setStep("email");
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
