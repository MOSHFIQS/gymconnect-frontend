import Link from "next/link";
import { Dumbbell, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card-bg pt-16 sm:pt-20 border-t border-white/10">
      <div className="max-w-[92%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/40">
                <Dumbbell className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-3xl font-black tracking-tight text-white">
                Gym<span className="text-accent">Connect</span>
              </span>
            </Link>
            <p className="text-footer-text text-sm leading-relaxed mb-6 max-w-sm">
              GymConnect is your premier fitness destination. Experience top-of-the-line equipment, certified trainers, and personalized memberships built for your fitness journey.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-footer-text">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span>124 Fitness Avenue, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span>Open 24 Hours / 7 Days a Week</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>+880 1700 000000</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5">Membership</h4>
            <ul className="space-y-3 text-sm text-footer-text">
              <li>
                <Link href="/#how-to-join" className="hover:text-accent transition-colors">
                  How to Join
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-accent transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-accent transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="hover:text-accent transition-colors">
                  Member Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Fitness Programs */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5">Programs</h4>
            <ul className="space-y-3 text-sm text-footer-text">
              <li>
                <Link href="/#training" className="hover:text-accent transition-colors">
                  Weight Training
                </Link>
              </li>
              <li>
                <Link href="/#training" className="hover:text-accent transition-colors">
                  Cardio &amp; HIIT
                </Link>
              </li>
              <li>
                <Link href="/#team" className="hover:text-accent transition-colors">
                  Personal Training
                </Link>
              </li>
              <li>
                <Link href="/#bmi" className="hover:text-accent transition-colors">
                  BMI &amp; Calorie Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5">Accepted Payments</h4>
            <p className="text-xs text-footer-text mb-4 leading-relaxed">
              We accept direct manual payments with instant verification:
            </p>
            <div className="flex flex-col gap-2 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/90">
                bKash Merchant Pay
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/90">
                Nagad Merchant Pay
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/90">
                Bank Wire Transfer
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs sm:text-sm text-footer-text">
          <p>&copy; {new Date().getFullYear()} GymConnect Management. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/#home" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/#home" className="hover:text-accent transition-colors">Terms of Service</Link>
            <Link href="/#how-to-join" className="hover:text-accent transition-colors">Help &amp; FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
