"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, Suspense } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Dumbbell,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const { signup, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const watchedPassword = useWatch({ control, name: "password" }) || "";

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!watchedPassword) return { score: 0, label: "", color: "" };
    let score = 0;
    if (watchedPassword.length >= 6) score++;
    if (watchedPassword.length >= 8) score++;
    if (/[A-Z]/.test(watchedPassword)) score++;
    if (/[0-9]/.test(watchedPassword)) score++;
    if (/[^A-Za-z0-9]/.test(watchedPassword)) score++;

    if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score: 2, label: "Fair", color: "bg-amber-500" };
    if (score <= 4) return { score: 3, label: "Good", color: "bg-sky-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
  }, [watchedPassword]);

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/auth/signup", {
        email: values.email,
        password: values.password,
      });

      if (response.data?.success && response.data?.data) {
        const { token, user: registeredUser } = response.data.data;
        signup(token, registeredUser);
        toast.success("Account created successfully! Let's complete your profile.");
        // Redirect to register wizard with selected plan if available
        if (planParam) {
          router.push(`/register?plan=${planParam}`);
        } else {
          router.push("/register");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Sign up failed. Please try again.");
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
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
          alt="GymConnect gym training session"
          fill
          className="object-cover object-center brightness-[0.35] scale-105"
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

        {/* Center Benefits */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/25 border border-accent/40 text-accent text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Start Your Fitness Journey
          </div>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-white">
            Join the Elite <br />
            <span className="gradient-text">GymConnect Community</span>
          </h1>
          <p className="text-secondary-text text-base leading-relaxed">
            Create your member account in under 30 seconds. Unlock customized workout tracking, flexible payment options, and professional coaching.
          </p>

          {/* Member Benefits Checklist */}
          <div className="space-y-3 pt-2">
            {[
              "Unlimited access to commercial gym floor & weights",
              "Instant subscription approval via bKash, Nagad & Bank Wire",
              "Personalized diet & strength training roadmaps",
              "Certified coaching consultations & progress tracking",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center gap-6 text-xs text-secondary-text">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>No Long-Term Contracts</span>
          </div>
          <span>•</span>
          <span>Cancel Anytime</span>
        </div>
      </div>

      {/* Right Column: Sign Up Form */}
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
            href="/auth/signin"
            className="text-xs font-bold text-accent hover:underline"
          >
            Already a member? Sign In
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

            {/* Plan notification badge if chosen from landing */}
            {planParam && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/15 border border-accent/30 text-accent text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Selected Plan: {planParam.toUpperCase()}</span>
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Create Your Account
            </h2>
            <p className="text-xs sm:text-sm text-secondary-text mt-1">
              Sign up today and take the first step towards your dream physique.
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
              <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
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

              {/* Password Strength Indicator */}
              {watchedPassword && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/50">Password Strength:</span>
                    <span className="font-bold">{passwordStrength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.score >= level
                            ? passwordStrength.color
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  className="w-full bg-white/5 border border-white/10 focus:border-accent rounded-xl py-3 pl-11 pr-11 text-white text-sm outline-none transition-all placeholder:text-white/30"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5 text-white/40" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-accent">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms text */}
            <p className="text-[11px] text-white/50 leading-relaxed pt-1">
              By creating an account, you agree to GymConnect&apos;s Terms of Service and Privacy Policy.
            </p>

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
                  <span>Create Account &amp; Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="text-center pt-2 border-t border-white/10">
            <p className="text-xs sm:text-sm text-secondary-text">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-accent hover:underline font-bold"
              >
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
