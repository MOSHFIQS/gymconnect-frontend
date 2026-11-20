"use client";

import Link from "next/link";
import { UserPlus, ClipboardCheck, Dumbbell, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HowToJoin() {
  const { user } = useAuth();

  const steps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Create Your Account",
      description: "Sign up in under 30 seconds with just your email and password. No credit card required to start.",
      badge: "Step 1",
      link: user ? "/dashboard" : "/auth/signup",
      buttonText: user ? "Go to Dashboard" : "Sign Up Free",
    },
    {
      step: "02",
      icon: ClipboardCheck,
      title: "Choose Membership Plan",
      description: "Select from Monthly, Quarterly, Half-Yearly or Yearly plans tailored to your personal fitness goals.",
      badge: "Step 2",
      link: user ? "/register" : "/auth/signup",
      buttonText: "Browse Plans",
    },
    {
      step: "03",
      icon: Dumbbell,
      title: "Pay & Start Working Out",
      description: "Submit your payment easily via bKash, Nagad, or Bank Transfer. Get instant verification and 24/7 gym access.",
      badge: "Step 3",
      link: user ? "/dashboard" : "/auth/signup",
      buttonText: "Get Access",
    },
  ];

  return (
    <section id="how-to-join" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[90%] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5 tracking-tight">
            How to Join <span className="gradient-text">GymConnect</span>
          </h2>
          <p className="text-secondary-text text-base sm:text-lg leading-relaxed">
            Wondering how to become a member? You can start right now! Follow these 3 simple steps to register, choose your membership package, and unlock full gym access.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="glass rounded-3xl p-8 relative border border-white/10 hover:border-accent/40 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-white/20 group-hover:text-accent/60 transition-colors">
                    {item.step}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-accent">
                    {item.badge}
                  </span>
                </div>

                {/* Icon & Details */}
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/10">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-secondary-text text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Link */}
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-accent transition-colors pt-4 border-t border-white/5"
                >
                  <span>{item.buttonText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Callout Banner */}
        <div className="bg-gradient-to-r from-card-bg via-[#262626] to-card-bg border border-accent/30 rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5 text-center lg:text-left">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0 hidden sm:flex">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Ready to transform your life with GymConnect?
              </h4>
              <p className="text-secondary-text text-sm sm:text-base">
                Join our community of 1,200+ athletes and members today. Instant registration with no hidden fees.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {user ? (
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-full font-bold text-base bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/30 transition-all duration-300"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="px-8 py-3.5 rounded-full font-bold text-base bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/30 transition-all duration-300 hover:scale-105"
                >
                  Register Now
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-7 py-3.5 rounded-full font-bold text-base bg-white/5 hover:bg-white/10 border border-white/15 text-white transition-all duration-300"
                >
                  Already a Member? Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
