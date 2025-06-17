"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon, X } from "lucide-react";
import { useUser } from "@/components/shared/UserProvider";
import { supabase } from "@/lib/supabase";
import { TbPawFilled } from "react-icons/tb";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useUser();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 flex items-center gap-2"
        >
          <TbPawFilled className="text-2xl" />
          TrustPaws
        </Link>

        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <Link href="/services" className="hover:text-black transition">
            Find a pet sitter
          </Link>
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="hover:text-black transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="hover:text-black transition"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="hover:text-black transition">
                  Login
                </Link>
              )}
            </>
          )}
        </div>

        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-medium text-gray-700">
          <Link
            href="/"
            className="block hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/services"
            className="block hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            Find a pet sitter
          </Link>
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block hover:text-black"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="block hover:text-black w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block hover:text-black"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
