"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/components/shared/UserProvider";

export default function ProfileAutoCreate() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const ensureProfile = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (!data) {
          await supabase.from("profiles").insert([
            {
              id: user.id,
              email: user.email,
            },
          ]);
        }
      };
      ensureProfile();
    }
  }, [user]);

  return null;
}
