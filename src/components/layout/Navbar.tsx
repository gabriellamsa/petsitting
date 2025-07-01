"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { MenuIcon, X } from "lucide-react";
import { useUser } from "@/components/shared/UserProvider";
import { supabase } from "@/lib/supabase";
import { TbPawFilled } from "react-icons/tb";
import { FaDog } from "react-icons/fa";
import { FiEdit2, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading } = useUser();
  const [firstName, setFirstName] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const loadUserProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .maybeSingle();
        if (!error && data) {
          setFirstName(data.first_name || "");
        }
      };
      loadUserProfile();
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

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

        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-700 items-center">
          <Link href="/" className="hover:text-black transition">
            Início
          </Link>
          <Link href="/services" className="hover:text-black transition">
            Encontre um cuidador
          </Link>
          {!loading && user && (
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-gray-100 transition"
                onClick={() => setUserMenuOpen((prev) => !prev)}
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 text-gray-600 text-lg font-bold">
                  {firstName
                    ? firstName[0].toUpperCase()
                    : user.email
                    ? user.email[0].toUpperCase()
                    : ""}
                </span>
                <span className="font-semibold text-gray-800">
                  {firstName || user.email || ""}
                </span>
                <svg
                  className={`ml-1 w-4 h-4 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border z-50 p-4 flex flex-col gap-4">
                  <div className="flex flex-col items-center border-b pb-4 mb-2">
                    <button
                      className="flex flex-col items-center focus:outline-none cursor-pointer"
                      onClick={() => router.push("/dashboard")}
                    >
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 text-gray-600 text-2xl font-bold mb-2">
                        {firstName
                          ? firstName[0].toUpperCase()
                          : user.email
                          ? user.email[0].toUpperCase()
                          : ""}
                      </span>
                      <span className="font-semibold text-gray-900 text-lg">
                        {firstName || user.email || ""}
                      </span>
                    </button>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 text-gray-700 hover:text-black transition text-base"
                  >
                    <FiEdit2 className="text-xl" /> Editar perfil
                  </Link>
                  <Link
                    href="/dashboard/tutor"
                    className="flex items-center gap-3 text-gray-700 hover:text-black transition text-base"
                  >
                    <FaDog className="text-xl" /> Meus pets
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 text-gray-700 hover:text-black transition text-base w-full text-left"
                  >
                    <FiLogOut className="text-xl" /> Sair
                  </button>
                </div>
              )}
            </div>
          )}
          {!loading && !user && (
            <Link href="/login" className="hover:text-black transition">
              Login
            </Link>
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
            Início
          </Link>
          <Link
            href="/services"
            className="block hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            Encontre um cuidador
          </Link>
          {!loading && user && (
            <div className="bg-white rounded-lg shadow p-4 mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-3 border-b pb-3 mb-2">
                <button
                  className="flex items-center gap-3 focus:outline-none cursor-pointer"
                  onClick={() => router.push("/dashboard")}
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 text-lg font-bold">
                    {firstName
                      ? firstName[0].toUpperCase()
                      : user.email
                      ? user.email[0].toUpperCase()
                      : ""}
                  </span>
                  <span className="font-semibold text-gray-900 text-base">
                    {firstName || user.email || ""}
                  </span>
                </button>
              </div>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 text-gray-700 hover:text-black transition text-base"
                onClick={() => setIsOpen(false)}
              >
                <FiEdit2 className="text-xl" /> Editar perfil
              </Link>
              <Link
                href="/dashboard/tutor"
                className="flex items-center gap-3 text-gray-700 hover:text-black transition text-base"
                onClick={() => setIsOpen(false)}
              >
                <FaDog className="text-xl" /> Meus pets
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 text-gray-700 hover:text-black transition text-base w-full text-left"
              >
                <FiLogOut className="text-xl" /> Sair
              </button>
            </div>
          )}
          {!loading && !user && (
            <Link
              href="/login"
              className="block hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
