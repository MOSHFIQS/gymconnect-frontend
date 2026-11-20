"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Dumbbell, ShieldCheck, Printer, Sparkles, QrCode } from "lucide-react";

interface MemberCardProps {
  member: {
    id: string;
    fullName: string;
    email?: string;
    phone: string;
    membershipPlan: "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY";
    status: "PENDING" | "ACTIVE" | "INACTIVE";
    joiningDate?: string;
    profileImage?: string | null;
  };
}

export default function DigitalMemberCard({ member }: MemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case "YEARLY":
        return { label: "YEARLY ELITE VIP", badgeColor: "bg-amber-400 text-black border-amber-300" };
      case "HALF_YEARLY":
        return { label: "HALF-YEARLY PRO", badgeColor: "bg-accent text-white border-accent" };
      case "QUARTERLY":
        return { label: "QUARTERLY GROWTH", badgeColor: "bg-sky-400 text-black border-sky-300" };
      default:
        return { label: "MONTHLY STARTER", badgeColor: "bg-white/20 text-white border-white/30" };
    }
  };

  const planInfo = getPlanDetails(member.membershipPlan);
  const memberCode = `GC-${member.id.substring(0, 8).toUpperCase()}`;

  const calculateExpiry = (joining: string, plan: string) => {
    const d = new Date(joining);
    if (isNaN(d.getTime())) return "1 Year from Join";
    const months = plan === "YEARLY" ? 12 : plan === "HALF_YEARLY" ? 6 : plan === "QUARTERLY" ? 3 : 1;
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const expiryDate = calculateExpiry(member.joiningDate || new Date().toISOString(), member.membershipPlan);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Printable Card Container */}
      <div
        ref={cardRef}
        id="digital-gym-card"
        className="w-full max-w-md mx-auto aspect-[1.586/1] rounded-3xl p-6 sm:p-7 relative overflow-hidden text-white shadow-2xl border-2 border-accent/40 bg-gradient-to-br from-[#1a1716] via-[#121212] to-[#241a18]"
      >
        {/* Holographic metallic background lines */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/25 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar: Brand & Plan Badge */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shadow-md shadow-accent/40">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight leading-none block">
                Gym<span className="text-accent">Connect</span>
              </span>
              <span className="text-[8px] tracking-widest uppercase text-white/50 font-bold block">
                Official VIP Pass
              </span>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border shadow-sm ${planInfo.badgeColor}`}
          >
            {planInfo.label}
          </span>
        </div>

        {/* Center Content: Photo + Details */}
        <div className="flex items-center gap-4 relative z-10 mb-4">
          {/* Member Photo */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-accent/50 shadow-xl relative shrink-0 bg-neutral-900">
            {member.profileImage ? (
              <Image
                src={member.profileImage}
                alt={member.fullName}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 text-2xl font-black">
                {member.fullName.charAt(0)}
              </div>
            )}
          </div>

          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-black truncate text-white leading-tight">
              {member.fullName}
            </h3>
            <p className="text-xs text-white/60 truncate font-mono mt-0.5">
              {member.email}
            </p>
            <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-accent">
              <span>ID:</span>
              <span className="font-bold">{memberCode}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Status, Expiry & QR Code */}
        <div className="flex items-end justify-between pt-3 border-t border-white/10 relative z-10">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                {member.status === "ACTIVE" ? "Verified & Active" : member.status}
              </span>
            </div>
            <div className="text-[10px] text-white/50">
              Valid Thru: <span className="text-white font-medium">{expiryDate}</span>
            </div>
          </div>

          {/* QR Code representation */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white p-1 rounded-lg flex items-center justify-center shadow-md">
              {/* Clean SVG QR code representation */}
              <svg viewBox="0 0 24 24" className="w-full h-full text-black fill-current">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm11-2h2v2h-2v-2zm3 0h3v3h-3v-3zm-3 3h2v2h-2v-2zm3 2h3v3h-3v-3zm-6-2h2v5h-2v-5zm3 3h2v2h-2v-2z" />
              </svg>
            </div>
            <span className="text-[8px] font-mono text-white/40 mt-0.5 uppercase tracking-wider">
              Scan at Door
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Toolbar */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all shadow-md cursor-pointer"
        >
          <Printer className="w-4 h-4 text-accent" />
          <span>Print / Save ID Pass</span>
        </button>
      </div>
    </div>
  );
}
