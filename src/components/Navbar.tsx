"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, LayoutDashboard, Menu, X, Dumbbell, UserPlus, Sparkles } from "lucide-react";

export default function Navbar() {
  const { user, signout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "How to Join", href: "/#how-to-join" },
    { label: "Membership", href: "/#pricing" },
    { label: "Workouts", href: "/#training" },
    { label: "Trainers", href: "/#team" },
    { label: "BMI Calculator", href: "/#bmi" },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-2xl shadow-black/40 py-3 bg-black/85 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[92%] mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
        >
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/40 group-hover:rotate-6 transition-transform">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white flex items-center">
              Gym<span className="text-accent">Connect</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-white/50 -mt-1 font-bold">
              Fitness & Training
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden xl:flex items-center gap-1 rounded-full border border-white/10 p-1.5 glass">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="block px-4 py-2 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {!user.member && user.role !== "ADMIN" && (
                <Link
                  href="/register"
                  className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30 transition-all duration-300 animate-pulse"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Complete Registration
                </Link>
              )}
              <Link
                href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-300"
              >
                <LayoutDashboard className="w-4 h-4 text-accent" />
                Dashboard
              </Link>
              <button
                onClick={() => signout()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-white/10 text-white/90 hover:text-red-400 transition-all duration-300 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/auth/signin"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                <User className="w-4 h-4 text-white/70" />
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/30 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-glow"
              >
                <UserPlus className="w-4 h-4" />
                Join GymConnect
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="xl:hidden w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white cursor-pointer z-50"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6 text-accent" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-6 transition-all duration-500 xl:hidden z-40 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-5 w-[80%] max-w-sm">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold text-white/80 hover:text-accent transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}

          <div className="w-full h-px bg-white/10 my-2" />

          {user ? (
            <div className="flex flex-col gap-3 w-full">
              {!user.member && user.role !== "ADMIN" && (
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold bg-accent text-white"
                >
                  <Sparkles className="w-4 h-4" />
                  Complete Registration
                </Link>
              )}
              <Link
                href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold bg-white/10 border border-white/10 text-white"
              >
                <LayoutDashboard className="w-4 h-4 text-accent" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signout();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-red-400"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              <Link
                href="/auth/signup"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-base font-bold bg-accent text-white shadow-lg shadow-accent/30"
              >
                <UserPlus className="w-5 h-5" />
                Join GymConnect Free
              </Link>
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-base font-semibold bg-white/5 border border-white/10 text-white"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
