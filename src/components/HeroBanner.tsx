"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Flame, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HeroBanner() {
  const { user } = useAuth();

  return (
    <section
      id="home"
      className="min-h-screen pt-32 pb-20 max-w-[92%] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-accent/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Text Content */}
      <div className="flex-1 animate-fade-in z-10">
        {/* Brand Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
          <Flame className="w-4 h-4 fill-accent" /> Welcome to GymConnect
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight text-white mb-6">
          Elevate Your <span className="gradient-text">Strength</span> &amp; Transform Your Body
        </h1>

        <p className="text-secondary-text text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
          The premier fitness sanctuary with state-of-the-art equipment, personalized workout coaching, and flexible membership tiers designed to unlock your peak physical potential.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {user ? (
            <Link
              href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
              className="px-8 sm:px-10 py-4 bg-accent text-white font-bold text-base sm:text-lg rounded-full hover:bg-accent-hover hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-accent/30 flex items-center gap-2"
            >
              <span>Go to Your Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/auth/signup"
              className="px-8 sm:px-10 py-4 bg-accent text-white font-bold text-base sm:text-lg rounded-full hover:bg-accent-hover hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-accent/30 flex items-center gap-2 animate-pulse-glow"
            >
              <span>Join GymConnect Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}

          <Link
            href="#pricing"
            className="px-8 sm:px-10 py-4 bg-white/5 text-white font-semibold text-base sm:text-lg rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Explore Plans
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
          <div>
            <h4 className="text-2xl sm:text-3xl font-black text-white">1,200+</h4>
            <p className="text-secondary-text text-xs sm:text-sm mt-0.5">Active Members</p>
          </div>
          <div>
            <h4 className="text-2xl sm:text-3xl font-black text-white">25+</h4>
            <p className="text-secondary-text text-xs sm:text-sm mt-0.5">Pro Trainers</p>
          </div>
          <div>
            <h4 className="text-2xl sm:text-3xl font-black text-accent">24/7</h4>
            <p className="text-secondary-text text-xs sm:text-sm mt-0.5">Gym Floor Access</p>
          </div>
        </div>
      </div>

      {/* Hero Visual Image */}
      <div className="flex-1 relative flex justify-center lg:justify-end animate-slide-up z-10 w-full max-w-xl">
        <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] max-w-[480px]">
          {/* Main Visual Image */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-black/80">
            <Image
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80"
              alt="GymConnect professional fitness training"
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
              priority
              sizes="(max-width: 768px) 100vw, 500px"
            />
            {/* Dark gradient blend at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Floating Stat Card - Top Right */}
          <div className="glass absolute -top-4 -right-2 sm:-right-6 rounded-2xl p-4 sm:p-5 animate-float shadow-xl border border-white/20 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">#1 Rated</h3>
                <p className="text-secondary-text text-xs">Gym in the City</p>
              </div>
            </div>
          </div>

          {/* Floating Stat Card - Bottom Left */}
          <div
            className="glass absolute -bottom-6 -left-2 sm:-left-6 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 animate-float shadow-xl border border-white/20 z-20"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/40 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Verified Membership</h3>
              <p className="text-secondary-text text-xs">Instant bKash &amp; Nagad approval</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
