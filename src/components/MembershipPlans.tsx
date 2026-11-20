"use client";

import Link from "next/link";
import { Check, Zap, Sparkles, Shield, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const PLANS = [
  {
    id: "MONTHLY",
    name: "Monthly Starter",
    price: 50,
    duration: "/ month",
    badge: null,
    popular: false,
    description: "Ideal for beginners or short-term fitness commitments.",
    features: [
      "Full gym equipment & weights access",
      "Standard locker room & shower",
      "Free initial fitness assessment",
      "Mobile workout tracker",
      "Gym open hours 6 AM - 11 PM",
    ],
  },
  {
    id: "QUARTERLY",
    name: "Quarterly Growth",
    price: 135,
    duration: "/ 3 months",
    savings: "Save 10%",
    badge: "Great Value",
    popular: false,
    description: "Solid 3-month commitment for visible body transformation.",
    features: [
      "All Monthly Starter features",
      "2 personal trainer coaching sessions",
      "Customized diet & workout schedule",
      "1 Free guest pass per month",
      "Access to group fitness classes",
    ],
  },
  {
    id: "HALF_YEARLY",
    name: "Half-Yearly Pro",
    price: 240,
    duration: "/ 6 months",
    savings: "Save 20%",
    badge: "Most Popular",
    popular: true,
    description: "The preferred choice for dedicated athletes and lifters.",
    features: [
      "24/7 Unlimited GymConnect access",
      "Dedicated personal locker",
      "Monthly 3D InBody body scan",
      "4 Personal trainer coaching sessions",
      "Full access to sauna & recovery zone",
      "10% discount on supplements & gear",
    ],
  },
  {
    id: "YEARLY",
    name: "Yearly Elite",
    price: 420,
    duration: "/ 12 months",
    savings: "Save 30%",
    badge: "Best Value",
    popular: false,
    description: "Complete 1-year transformation with VIP perks and savings.",
    features: [
      "Everything in Half-Yearly Pro",
      "Unlimited group & HIIT sessions",
      "8 Personal training sessions included",
      "Free GymConnect merchandise kit",
      "Unlimited guest day passes",
      "Priority equipment reservations",
    ],
  },
];

export default function MembershipPlans() {
  const { user } = useAuth();

  const getTargetUrl = (planId: string) => {
    if (user) {
      return `/register?plan=${planId}`;
    }
    return `/auth/signup?plan=${planId}`;
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 relative">
      <div className="max-w-[90%] mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Flexible Memberships
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5 tracking-tight">
            Membership Plans at <span className="gradient-text">GymConnect</span>
          </h2>
          <p className="text-secondary-text text-base sm:text-lg leading-relaxed">
            Transparent pricing with no hidden registration fees. Choose a plan, register your member profile, and start training today.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                plan.popular
                  ? "bg-gradient-to-b from-card-bg via-[#262120] to-card-bg border-2 border-accent shadow-2xl shadow-accent/20 -translate-y-2 lg:-translate-y-3"
                  : "glass border border-white/10 hover:border-white/25 hover:-translate-y-1"
              }`}
            >
              {/* Top Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      plan.popular
                        ? "bg-accent text-white shadow-lg shadow-accent/40"
                        : "bg-white/15 text-white border border-white/20"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="mb-6 pt-2">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-secondary-text text-xs sm:text-sm min-h-[40px] leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-accent">$</span>
                    <span className="text-5xl font-black tracking-tight text-white">
                      {plan.price}
                    </span>
                    <span className="text-secondary-text text-sm ml-1">
                      {plan.duration}
                    </span>
                  </div>
                  {plan.savings && (
                    <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      {plan.savings}
                    </span>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/85">
                      <div className="w-4 h-4 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div>
                <Link
                  href={getTargetUrl(plan.id)}
                  className={`w-full block text-center py-3.5 px-6 rounded-full font-bold text-sm sm:text-base transition-all duration-300 ${
                    plan.popular
                      ? "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/30 hover:scale-105"
                      : "bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:border-white/30"
                  }`}
                >
                  {user ? "Choose " + plan.name : "Join with " + plan.name}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Support Footer */}
        <div className="mt-14 glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white">Multiple Payment Options Accepted</h5>
              <p className="text-xs text-secondary-text">Pay securely via bKash, Nagad, or Direct Bank Transfer upon registration.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-white/80">
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">bKash</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">Nagad</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">Bank Transfer</span>
          </div>
        </div>
      </div>
    </section>
  );
}
