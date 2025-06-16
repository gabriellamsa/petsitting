"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/components/UserProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AccountDetailsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user) {
      const loadUserData = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, username, phone_number")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error loading user profile:", error.message);
        } else if (data) {
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setUsername(data.username || "");
          setPhoneNumber(data.phone_number || "");
        }
      };
      loadUserData();
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    if (!user) {
      setError("User not logged in.");
      setSubmitting(false);
      return;
    }

    try {
      const updates = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        username: username,
        phone_number: phoneNumber,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;

      setSuccess("Changes saved successfully!");
    } catch (err: any) {
      console.error("Error saving changes:", err.message);
      setError(`Failed to save changes: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Account details
        </h1>
        <p className="text-gray-700 mb-8">
          Change your personal information and contact details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow rounded-lg p-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Contact details
            </h2>
            <div>
              <label
                htmlFor="emailAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="emailAddress"
                value={user?.email || ""}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 sm:text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
            </div>
          </div>

          {success && <p className="text-sm text-green-600 mt-4">{success}</p>}
          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
