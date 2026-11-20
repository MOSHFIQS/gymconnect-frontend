"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Dumbbell,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function Signin() {
  const { signin, user } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (values: SigninFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/auth/signin", values);

      if (response.data?.success && response.data?.data) {
        const { token, user: loggedUser } = response.data.data;
        signin(token, loggedUser);
        toast.success(`Welcome back, ${loggedUser.email}!`);
        if (loggedUser.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Left Column: Visual Showcase (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 xl:p-16 overflow-hidden border-r border-white/10">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
          alt="GymConnect athlete working out"
          fill
          className="object-cover object-center brightness-[0.38] scale-105"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Top Branding */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/40 group-hover:rotate-6 transition-transform">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white">
              Gym<span className="text-accent">Connect</span>
            </span>
          </Link>
        </div>

        {/* Center / Bottom Motivation */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/25 border border-accent/40 text-accent text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to Member Portal
          </div>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-white">
            Transform Your Body, <br />
            <span className="gradient-text">One Rep at a Time.</span>
          </h1>
          <p className="text-secondary-text text-base leading-relaxed">
            Sign in to access your workout tracking, view your membership status, submit subscription payments, and consult with certified trainers.
          </p>

          {/* Testimonial Quote Card */}
          <div className="glass rounded-2xl p-5 border border-white/10 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0 border border-accent/40">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Member avatar"
                fill
                className="object-cover"
                sizes="50px"
              />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-white/90 italic">
                &ldquo;GymConnect helped me lose 12kg and double my deadlift in 4 months. The member dashboard makes tracking simple!&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-white">Rahim Chowdhury</span>
                <span className="text-[10px] text-accent font-semibold">• Pro Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center gap-6 text-xs text-secondary-text">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <span>•</span>
          <span>Verified Gym Platform</span>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 relative z-10 min-h-screen">
        {/* Top Back Link */}
        <div className="w-full max-w-md flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/auth/signup"
            className="text-xs font-bold text-accent hover:underline"
          >
            New here? Sign Up
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md glass p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white">
                Gym<span className="text-accent">Connect</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Member Sign In
            </h2>
            <p className="text-xs sm:text-sm text-secondary-text mt-1">
              Enter your registered email and password to access your gym account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-accent rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder:text-white/30"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-accent">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                  Password
                </label>
                <span className="text-[11px] text-white/40 cursor-default">
                  Forgot? Ask Admin
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 focus:border-accent rounded-xl py-3 pl-11 pr-11 text-white text-sm outline-none transition-all placeholder:text-white/30"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5 text-white/40" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-accent">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 accent-[#e6533c] cursor-pointer"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to GymConnect</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-xs sm:text-sm text-secondary-text">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/auth/signup"
                className="text-accent hover:underline font-bold"
              >
                Create Account &amp; Join
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
