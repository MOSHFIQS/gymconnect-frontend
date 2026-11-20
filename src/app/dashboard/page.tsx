"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import DigitalMemberCard from "@/components/DigitalMemberCard";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CreditCard,
  AlertCircle,
  Plus,
  X,
  FileText,
  DollarSign,
  User as UserIcon,
  CheckCircle,
  Clock,
  Ban,
  Copy,
  Dumbbell,
  CalendarCheck,
  Droplets,
  Bell,
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  RotateCw,
} from "lucide-react";

interface GatewayDetails {
  bkash: { merchantNumber: string };
  nagad: { merchantNumber: string };
  bankTransfer: { bankName: string; accountNumber: string; routingNumber: string };
}

interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  method: "BKASH" | "NAGAD" | "BANK_TRANSFER";
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  adminNote?: string | null;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  createdAt: string;
}

interface AttendanceItem {
  id: string;
  checkInDate: string;
  notes?: string;
}

interface AttendanceData {
  attendances: AttendanceItem[];
  totalCount: number;
  thisMonthCount: number;
  lastCheckIn: string | null;
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  tip: string;
}

interface WorkoutRoutine {
  id: string;
  name: string;
  focus: string;
  days: string;
  level: string;
  color: string;
  exercises: Exercise[];
}

const PLAN_PRICES: Record<string, number> = {
  MONTHLY: 50,
  QUARTERLY: 135,
  HALF_YEARLY: 240,
  YEARLY: 420,
};

const paymentModalSchema = z.object({
  transactionId: z.string().min(4, "Transaction ID must be at least 4 characters"),
  amount: z.number().positive("Amount must be positive"),
  method: z.enum(["BKASH", "NAGAD", "BANK_TRANSFER"]),
  memberId: z.string().optional(),
});

type PaymentModalValues = z.infer<typeof paymentModalSchema>;

export default function MemberDashboard() {
  const { user, refetchUser } = useAuth();
  const router = useRouter();

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<"overview" | "workouts" | "attendance" | "payments">("overview");

  // Payments State
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [gateway, setGateway] = useState<GatewayDetails | null>(null);

  // Notices & Announcements State
  const [notices, setNotices] = useState<Notice[]>([]);

  // Attendance State
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Workout Routines State
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);
  const [isLoggingWorkout, setIsLoggingWorkout] = useState(false);

  // Water Tracker State (Daily goal 2500ml)
  const [waterDrunk, setWaterDrunk] = useState<number>(1000);

  const fetchPayments = async () => {
    try {
      const res = await apiClient.get("/payments/my");
      if (res.data?.success && res.data?.data) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load payments history", err);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await apiClient.get("/notices");
      if (res.data?.success && res.data?.data) {
        setNotices(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load notices", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await apiClient.get("/attendance/my");
      if (res.data?.success && res.data?.data) {
        setAttendance(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load attendance", err);
    }
  };

  const fetchRoutines = async () => {
    try {
      const res = await apiClient.get("/workouts/routines");
      if (res.data?.success && res.data?.data) {
        setRoutines(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedRoutine(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load workout routines", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPayments();
      fetchNotices();
      fetchAttendance();
      fetchRoutines();
    }
  }, [user]);

  // Fetch gateway details when modal opens
  useEffect(() => {
    if (isModalOpen && !gateway) {
      apiClient
        .get("/payments/details")
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            setGateway(res.data.data);
          }
        })
        .catch(() => {});
    }
  }, [isModalOpen, gateway]);

  const memberProfile = user?.member;
  const currentPlan = memberProfile?.membershipPlan || "MONTHLY";
  const requiredAmount = PLAN_PRICES[currentPlan] || 50;

  // Form hooks for payment creation modal
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<PaymentModalValues>({
    resolver: zodResolver(paymentModalSchema),
    defaultValues: {
      amount: requiredAmount,
      method: "BKASH",
      memberId: memberProfile?.id || "",
      transactionId: "",
    },
  });

  // Keep form updated when member profile or required plan amount changes
  useEffect(() => {
    if (memberProfile?.id) {
      setValue("memberId", memberProfile.id);
    }
    if (requiredAmount) {
      setValue("amount", requiredAmount);
    }
  }, [memberProfile, requiredAmount, setValue]);

  const selectedModalMethod = useWatch({ control, name: "method" });

  const handleOpenPaymentModal = () => {
    if (memberProfile?.id) {
      setValue("memberId", memberProfile.id);
    }
    setValue("amount", requiredAmount);
    setIsModalOpen(true);
  };

  const onPaymentSubmit = async (values: PaymentModalValues) => {
    setIsSubmittingPayment(true);
    try {
      const payload = {
        ...values,
        memberId: values.memberId || memberProfile?.id,
      };
      const response = await apiClient.post("/payments", payload);
      if (response.data?.success) {
        toast.success("Payment submitted successfully! Admin will verify shortly.");
        setIsModalOpen(false);
        reset();
        await fetchPayments();
        await refetchUser();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit payment");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (paymentFilter === "ALL") return true;
    return p.status === paymentFilter;
  });

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const res = await apiClient.post("/attendance/check-in", {
        notes: "Member portal check-in",
      });
      if (res.data?.success) {
        toast.success(res.data.message || "Checked in successfully!");
        await fetchAttendance();
      }
    } catch (err: any) {
      toast.error(err.message || "Check-in failed");
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleLogWorkout = async (routineName: string) => {
    setIsLoggingWorkout(true);
    try {
      const res = await apiClient.post("/workouts/log", {
        routineName,
        notes: "Completed full exercise sets at GymConnect",
      });
      if (res.data?.success) {
        toast.success(res.data.message || "Workout session logged!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to log workout");
    } finally {
      setIsLoggingWorkout(false);
    }
  };

  const addWater = (amount: number) => {
    setWaterDrunk((prev) => Math.min(4000, prev + amount));
    toast.success(`Logged +${amount}ml water! Stay hydrated.`);
  };

  const getMemberStatusBadge = (status: "PENDING" | "ACTIVE" | "INACTIVE") => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> ACTIVE
          </span>
        );
      case "PENDING":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> PENDING VERIFICATION
          </span>
        );
      case "INACTIVE":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <Ban className="w-3.5 h-3.5" /> INACTIVE / EXPIRED
          </span>
        );
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-28 pb-16 px-4 relative overflow-hidden">
        {/* Visual lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          {/* Header Banner */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-bl-full pointer-events-none" />

            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white shadow-xl shadow-accent/40 font-black text-2xl shrink-0">
                {memberProfile ? memberProfile.fullName.charAt(0) : "G"}
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    {memberProfile ? `Welcome, ${memberProfile.fullName}` : "Welcome to GymConnect"}
                  </h1>
                </div>
                <p className="text-sm text-secondary-text mt-1">
                  {user?.email} • Member ID:{" "}
                  <span className="font-mono text-accent">
                    {memberProfile ? `GC-${memberProfile.id.substring(0, 8).toUpperCase()}` : "Pending"}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Check-in & Status */}
            <div className="flex flex-wrap items-center gap-3">
              {memberProfile && memberProfile.status === "ACTIVE" ? (
                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{isCheckingIn ? "Recording..." : "Check In to Gym Today"}</span>
                </button>
              ) : (
                <div className="text-xs text-secondary-text">
                  Status: {memberProfile ? getMemberStatusBadge(memberProfile.status) : "Not Registered"}
                </div>
              )}
            </div>
          </div>

          {/* Registration Warning Banner if not registered */}
          {!memberProfile && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-accent/15 border border-accent/30 rounded-3xl animate-pulse">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Complete your member profile</h3>
                  <p className="text-sm text-white/70 mt-0.5">
                    Create your profile and pick a membership plan to unlock your digital ID card &amp; full gym pass.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/register")}
                className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-accent/20 shrink-0 cursor-pointer"
              >
                Complete Profile Now
              </button>
            </div>
          )}

          {/* Live Gym Announcements Banner */}
          {notices.length > 0 && (
            <div className="glass rounded-2xl p-4 sm:p-5 border border-accent/30 bg-accent/5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-accent uppercase tracking-wider">
                    Gym Announcement
                  </span>
                  <span className="text-[10px] text-white/50">
                    {new Date(notices[0].createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {notices[0].title}
                </h4>
                <p className="text-xs sm:text-sm text-secondary-text mt-1 leading-relaxed">
                  {notices[0].content}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
            {[
              { id: "overview", label: "Overview & VIP Pass", icon: Sparkles },
              { id: "workouts", label: "Workout Routines", icon: Dumbbell },
              { id: "attendance", label: "Attendance & Streak", icon: CalendarCheck },
              { id: "payments", label: "Payments & Invoices", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-accent text-white shadow-lg shadow-accent/25"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & VIP PASS */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Digital VIP Member Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" /> Digital Membership Pass
                  </h3>
                  <p className="text-xs text-secondary-text">
                    Present your digital QR pass at the GymConnect front desk for entry.
                  </p>

                  {memberProfile ? (
                    <DigitalMemberCard member={memberProfile} />
                  ) : (
                    <div className="text-center py-12 text-secondary-text text-sm">
                      Register your profile to generate your VIP card.
                    </div>
                  )}
                </div>

                {/* Daily Water Hydration Tracker */}
                <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-sky-400" /> Daily Water Tracker
                    </h4>
                    <span className="text-xs text-sky-400 font-bold">
                      Goal: 2,500 ml
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-white/80">
                      <span>Consumed Today</span>
                      <span className="font-bold">{waterDrunk} ml / 2,500 ml</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (waterDrunk / 2500) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Add Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => addWater(250)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 transition-all cursor-pointer"
                    >
                      +250ml Glass
                    </button>
                    <button
                      type="button"
                      onClick={() => addWater(500)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 transition-all cursor-pointer"
                    >
                      +500ml Bottle
                    </button>
                    <button
                      type="button"
                      onClick={() => setWaterDrunk(0)}
                      className="px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Member Stats & Recent Activity */}
              <div className="lg:col-span-7 space-y-6">
                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass rounded-2xl p-5 border border-white/10">
                    <span className="text-xs text-secondary-text block mb-1">Monthly Streak</span>
                    <div className="text-3xl font-black text-white flex items-center gap-2">
                      <Flame className="w-6 h-6 text-orange-500" />
                      <span>{attendance?.thisMonthCount || 0}</span>
                      <span className="text-xs text-white/50 font-normal">days</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 mt-2 font-medium">
                      Gym attendance this month
                    </p>
                  </div>

                  <div className="glass rounded-2xl p-5 border border-white/10">
                    <span className="text-xs text-secondary-text block mb-1">Current Plan</span>
                    <div className="text-xl font-black text-accent truncate mt-1">
                      {memberProfile?.membershipPlan || "None"}
                    </div>
                    <p className="text-[11px] text-secondary-text mt-2">
                      ${requiredAmount} / billing cycle
                    </p>
                  </div>

                  <div className="glass rounded-2xl p-5 border border-white/10">
                    <span className="text-xs text-secondary-text block mb-1">Account Status</span>
                    <div className="mt-1">
                      {memberProfile ? getMemberStatusBadge(memberProfile.status) : "PENDING"}
                    </div>
                    <p className="text-[11px] text-white/50 mt-2">
                      Instant 24/7 Floor Access
                    </p>
                  </div>
                </div>

                {/* Profile Information Summary */}
                <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/10 pb-3">
                    <UserIcon className="w-5 h-5 text-accent" /> Profile Credentials
                  </h3>

                  {memberProfile ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-secondary-text block">Full Name</span>
                        <span className="font-bold text-white text-base">{memberProfile.fullName}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-secondary-text block">Registered Email</span>
                        <span className="font-bold text-white text-base truncate">{user?.email}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-secondary-text block">Phone Contact</span>
                        <span className="font-bold text-white text-base">{memberProfile.phone}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-secondary-text block">Emergency Contact</span>
                        <span className="font-bold text-white text-base">{memberProfile.emergencyContact}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 sm:col-span-2">
                        <span className="text-secondary-text block">Gym Address</span>
                        <span className="font-medium text-white/90">{memberProfile.address}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-secondary-text text-sm">Please register your profile to view details.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORKOUT ROUTINES */}
          {activeTab === "workouts" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Dumbbell className="w-6 h-6 text-accent" /> GymConnect Workout Splits
                  </h2>
                  <p className="text-xs sm:text-sm text-secondary-text">
                    Follow scientifically calibrated routines created by certified GymConnect trainers.
                  </p>
                </div>

                {selectedRoutine && (
                  <button
                    type="button"
                    onClick={() => handleLogWorkout(selectedRoutine.name)}
                    disabled={isLoggingWorkout}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isLoggingWorkout ? "Logging..." : `Log "${selectedRoutine.name}" Completed`}</span>
                  </button>
                )}
              </div>

              {/* Routine Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {routines.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoutine(r)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedRoutine?.id === r.id
                        ? "bg-accent/15 border-accent shadow-xl shadow-accent/20"
                        : "glass border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">
                      {r.days}
                    </span>
                    <h4 className="text-base font-bold text-white mb-1">{r.name}</h4>
                    <p className="text-xs text-secondary-text">{r.focus}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/5">
                      <span>{r.exercises.length} Exercises</span>
                      <span className="text-accent font-semibold">{r.level}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Routine Detail */}
              {selectedRoutine && (
                <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase text-accent tracking-wider">
                        {selectedRoutine.level} Routine
                      </span>
                      <h3 className="text-2xl font-black text-white mt-0.5">
                        {selectedRoutine.name}
                      </h3>
                      <p className="text-xs text-secondary-text mt-1">{selectedRoutine.focus}</p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white/80 self-start sm:self-auto">
                      Schedule: {selectedRoutine.days}
                    </span>
                  </div>

                  {/* Exercises Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRoutine.exercises.map((ex, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent/40 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">
                              {i + 1}
                            </span>
                            {ex.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-accent">
                            {ex.sets} × {ex.reps}
                          </span>
                        </div>
                        <div className="text-xs text-secondary-text bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-start gap-2">
                          <span className="text-accent font-bold">Pro Tip:</span>
                          <span className="text-white/80">{ex.tip}</span>
                        </div>
                        <div className="text-[11px] text-white/40 flex justify-end">
                          Rest: {ex.rest}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ATTENDANCE & CHECK-INS */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <CalendarCheck className="w-6 h-6 text-accent" /> Attendance &amp; Gym Streaks
                  </h2>
                  <p className="text-xs sm:text-sm text-secondary-text">
                    Log your daily gym check-ins and track your workout consistency.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn || !memberProfile || memberProfile.status !== "ACTIVE"}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{isCheckingIn ? "Logging..." : "Log Check-In Today"}</span>
                </button>
              </div>

              {/* Attendance Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass rounded-2xl p-5 border border-white/10 text-center">
                  <span className="text-xs text-secondary-text block mb-1">Check-ins This Month</span>
                  <div className="text-3xl font-black text-accent">{attendance?.thisMonthCount || 0}</div>
                  <span className="text-xs text-white/50">Target: 20 sessions/month</span>
                </div>

                <div className="glass rounded-2xl p-5 border border-white/10 text-center">
                  <span className="text-xs text-secondary-text block mb-1">Lifetime Check-ins</span>
                  <div className="text-3xl font-black text-white">{attendance?.totalCount || 0}</div>
                  <span className="text-xs text-white/50">Total recorded workouts</span>
                </div>

                <div className="glass rounded-2xl p-5 border border-white/10 text-center">
                  <span className="text-xs text-secondary-text block mb-1">Last Gym Check-in</span>
                  <div className="text-sm font-bold text-white mt-2 truncate">
                    {attendance?.lastCheckIn
                      ? new Date(attendance.lastCheckIn).toLocaleString()
                      : "No check-ins yet"}
                  </div>
                  <span className="text-xs text-emerald-400">Recorded entry</span>
                </div>
              </div>

              {/* Attendance Log Table */}
              <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" /> Recent Check-in Logs
                </h3>

                {attendance?.attendances.length === 0 ? (
                  <p className="text-xs text-secondary-text text-center py-8">
                    No check-ins logged yet. Click &quot;Log Check-In Today&quot; above when you arrive at GymConnect!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-xs text-secondary-text uppercase">
                          <th className="pb-3 pr-4">Date &amp; Time</th>
                          <th className="pb-3 px-4">Session Notes</th>
                          <th className="pb-3 pl-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                        {attendance?.attendances.map((item) => (
                          <tr key={item.id} className="hover:bg-white/5">
                            <td className="py-3 pr-4 font-mono">
                              {new Date(item.checkInDate).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-white/80">
                              {item.notes || "Gym Floor Workout"}
                            </td>
                            <td className="py-3 pl-4 text-emerald-400 font-bold">
                              Verified Entry
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS & INVOICES */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              {/* Status Banner if pending membership */}
              {memberProfile && memberProfile.status !== "ACTIVE" && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>
                      Your membership status is currently <strong className="uppercase font-bold text-amber-400">{memberProfile.status}</strong>. Submit your payment receipt below so the administration can approve your VIP pass!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenPaymentModal}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 self-start sm:self-auto cursor-pointer transition-colors shadow-lg shadow-amber-500/20"
                  >
                    Submit Payment Now
                  </button>
                </div>
              )}

              <div className="glass border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" /> Payment History &amp; Receipts
                    </h3>
                    <p className="text-xs text-secondary-text mt-0.5">
                      Recent transactions logged to activate or renew your subscription.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={fetchPayments}
                      title="Reload payments"
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                    >
                      <RotateCw className={`w-4 h-4 ${isLoadingPayments ? "animate-spin text-accent" : ""}`} />
                    </button>

                    {memberProfile ? (
                      <button
                        type="button"
                        onClick={handleOpenPaymentModal}
                        className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-accent/15 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Submit New Payment
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => router.push("/register")}
                        className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-accent/15 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4" /> Register Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                  {(
                    [
                      { key: "ALL", label: "All Transactions", count: payments.length },
                      { key: "PENDING", label: "Pending", count: payments.filter((p) => p.status === "PENDING").length },
                      { key: "APPROVED", label: "Approved", count: payments.filter((p) => p.status === "APPROVED").length },
                      { key: "REJECTED", label: "Rejected", count: payments.filter((p) => p.status === "REJECTED").length },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setPaymentFilter(tab.key)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        paymentFilter === tab.key
                          ? "bg-accent text-white shadow-md shadow-accent/20"
                          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${paymentFilter === tab.key ? "bg-black/30 text-white" : "bg-white/10 text-white/70"}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Table details */}
                {isLoadingPayments ? (
                  <div className="space-y-3">
                    <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                    <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
                  </div>
                ) : filteredPayments.length === 0 ? (
                  <div className="text-center py-12 space-y-3 border border-dashed border-white/10 rounded-2xl">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/40">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-secondary-text">
                      {payments.length === 0
                        ? "No transaction history found."
                        : `No ${paymentFilter.toLowerCase()} transactions found.`}
                    </p>
                    {payments.length === 0 && memberProfile && (
                      <button
                        type="button"
                        onClick={handleOpenPaymentModal}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent font-bold hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Submit your first payment transaction
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-xs text-secondary-text uppercase tracking-wider">
                          <th className="pb-3 pr-4">Transaction ID</th>
                          <th className="pb-3 px-4">Amount</th>
                          <th className="pb-3 px-4">Method</th>
                          <th className="pb-3 px-4">Status</th>
                          <th className="pb-3 pl-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredPayments.map((p) => (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 pr-4 font-mono font-medium text-xs sm:text-sm">
                              {p.transactionId}
                            </td>
                            <td className="py-4 px-4 font-bold text-accent text-sm">
                              ${p.amount}
                            </td>
                            <td className="py-4 px-4 text-xs font-semibold">
                              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                                {p.method}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-xs">
                              {p.status === "APPROVED" && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/10">
                                  Approved
                                </span>
                              )}
                              {p.status === "PENDING" && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/10">
                                  Pending
                                </span>
                              )}
                              {p.status === "REJECTED" && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/10">
                                  Rejected
                                </span>
                              )}
                            </td>
                            <td className="py-4 pl-4 text-secondary-text text-xs whitespace-nowrap">
                              {new Date(p.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-1.5 text-white/50 hover:text-white rounded-full bg-white/5 border border-white/5 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-accent" /> Submit Renewal Payment
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Enter your payment transaction reference for quick admin verification.
              </p>
            </div>

            <form onSubmit={handleSubmit(onPaymentSubmit)} className="space-y-4">
              {/* Method Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-text block mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["BKASH", "NAGAD", "BANK_TRANSFER"] as const).map((m) => (
                    <label
                      key={m}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        selectedModalMethod === m
                          ? "bg-accent/20 border-accent text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        value={m}
                        className="hidden"
                        {...register("method")}
                      />
                      <span>{m === "BANK_TRANSFER" ? "Bank Wire" : m}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs space-y-1">
                <span className="text-accent font-bold">Transfer Instructions:</span>
                <p className="text-white/80">
                  {selectedModalMethod === "BKASH" &&
                    `Send payment to Merchant bKash: ${gateway?.bkash.merchantNumber || "01XXXXXXXXXX"}`}
                  {selectedModalMethod === "NAGAD" &&
                    `Send payment to Merchant Nagad: ${gateway?.nagad.merchantNumber || "01XXXXXXXXXX"}`}
                  {selectedModalMethod === "BANK_TRANSFER" &&
                    `Bank: ${gateway?.bankTransfer.bankName || "Dutch-Bangla Bank"} • A/C: ${gateway?.bankTransfer.accountNumber || "1234567890"}`}
                </p>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-text block mb-1">
                  Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-accent"
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className="text-xs text-accent mt-1">{errors.amount.message}</p>
                )}
              </div>

              {/* Transaction ID */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-text block mb-1">
                  Transaction ID / Ref
                </label>
                <input
                  type="text"
                  placeholder="e.g. TRX98372648"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-accent font-mono"
                  {...register("transactionId")}
                />
                {errors.transactionId && (
                  <p className="text-xs text-accent mt-1">{errors.transactionId.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-accent/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPayment ? "Submitting..." : "Submit Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
