"use client";

import { useUser } from "@/components/shared/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user) {
      const loadUserProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error loading user profile:", error.message);
        } else if (data) {
          setFirstName(data.first_name || "");
        }
      };
      loadUserProfile();
    }
  }, [user, loading, router]);

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
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome, {firstName || user.email}!
            </h1>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Your Profile
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-sm font-medium text-gray-900">{user.id}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/dashboard/settings"
                  className="text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Edit account details
                </Link>
              </div>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Account Status
              </h2>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                <span className="text-sm text-gray-900">Active</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Recent Activity
              </h2>
              <p className="text-sm text-gray-500">
                Last sign in:{" "}
                {new Date(user.last_sign_in_at || "").toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
