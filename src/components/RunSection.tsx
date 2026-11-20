"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RunSection() {
  const { user } = useAuth();

  return (
    <section className="max-w-[92%] mx-auto mb-20 sm:mb-28">
      <div className="bg-gradient-to-r from-card-bg via-[#262423] to-card-bg border border-white/10 rounded-3xl flex flex-col lg:flex-row items-center justify-between overflow-hidden shadow-2xl">
        {/* Text Content */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <Flame className="w-3.5 h-3.5" /> High Performance Cardio
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 text-white">
            Run an Extra <br />
            <span className="gradient-text">Mile Easily</span>
          </h2>
          <p className="text-secondary-text text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            Supercharge your cardiovascular stamina with our top-tier commercial treadmills, curved self-powered runners, and guided HIIT sprint programs at GymConnect.
          </p>

          <Link
            href={user ? "/dashboard" : "/auth/signup"}
            className="inline-flex items-center gap-2 px-10 py-4 bg-accent text-white font-bold text-base sm:text-lg rounded-full hover:bg-accent-hover hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-accent/30"
          >
            <span>{user ? "Go to Dashboard" : "Join GymConnect Today"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Image */}
        <div className="flex-1 w-full lg:w-auto h-72 sm:h-96 lg:h-[450px] relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=80"
            alt="GymConnect athlete cardio running"
            fill
            className="object-cover object-center hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 1024px) 100vw, 600px"
          />
          {/* Gradient overlay for text blending */}
          <div className="absolute inset-0 bg-gradient-to-r from-card-bg via-transparent to-transparent lg:block hidden" />
        </div>
      </div>
    </section>
  );
}
