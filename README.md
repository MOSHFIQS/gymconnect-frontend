# 🏋️‍♂️ GymConnect — Frontend Web Application & Member Portal

> The official client application for **GymConnect**, a full-featured fitness management platform built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**. This document outlines all frontend user journeys, interactive tools, member portal capabilities, admin features, and how they seamlessly connect with the GymConnect backend REST API.

---

## 📑 Table of Contents

- [Overview & Capabilities](#overview--capabilities)
- [Comprehensive Feature Catalog](#comprehensive-feature-catalog)
  - [1. Public Landing Page & Member Acquisition](#1-public-landing-page--member-acquisition)
  - [2. Smart Multi-Unit BMI & Metabolic Calculator](#2-smart-multi-unit-bmi--metabolic-calculator)
  - [3. Modern Authentication Experience](#3-modern-authentication-experience)
  - [4. Member Registration Wizard](#4-member-registration-wizard)
  - [5. Interactive Member Portal (Dashboard)](#5-interactive-member-portal-dashboard)
  - [6. Admin Control Center & Operations](#6-admin-control-center--operations)
  - [7. Manual Payment & Verification Workflow](#7-manual-payment--verification-workflow)
- [Frontend Architecture & Key Components](#frontend-architecture--key-components)
- [How Frontend Connects to Backend API](#how-frontend-connects-to-backend-api)
- [Routing Table & Page Structure](#routing-table--page-structure)
- [Local Setup & Development](#local-setup--development)
- [Environment Variables](#environment-variables)

---

## 🌟 Overview & Capabilities

GymConnect Frontend is designed to solve the two biggest challenges in gym management: **visitor-to-member conversion** and **long-term member engagement**. It provides:

1. **For Visitors**: An intuitive onboarding journey showing exact pricing, workout splits, certified trainers, a 3-step registration guide, and a multi-unit BMI/macro calculator.
2. **For Active Members**: A modern dashboard with a **Digital VIP Member QR Pass**, daily 1-click **Gym Check-in**, curated **Push/Pull/Legs/HIIT workout routines**, a daily **Hydration tracker**, and live **Announcements**.
3. **For Gym Admins**: Real-time KPI dashboard, searchable member registry with 1-click **CSV export**, transaction verification portal with proof review, and staff access management.

---

## 🚀 Comprehensive Feature Catalog

### 1. Public Landing Page & Member Acquisition
- **Hero Banner**:
  - High-resolution gym athlete photography and dynamic ambient lighting.
  - Quick trust metrics: `1,200+ Active Members`, `25+ Certified Coaches`, `24/7 Access`.
  - Direct Call-to-Actions: **"Join GymConnect Now"** (routes to signup) and **"Explore Plans"** (smooth scrolls to pricing).
- **How to Join GymConnect in 3 Easy Steps (`<HowToJoin />`)**:
  - **Step 1 — Create Account**: 30-second signup with email & password.
  - **Step 2 — Choose Membership Plan**: Select from Monthly, Quarterly, Half-Yearly, or Yearly.
  - **Step 3 — Pay & Start Working Out**: Send payment via bKash, Nagad, or Bank Wire for instant verification.
- **Membership Plans & Pricing Grid (`<MembershipPlans />`)**:
  - Displays all 4 real backend plans with detailed perk checklists:
    - **Monthly Starter**: $50/mo — Access to all gym equipment, locker room, initial fitness check.
    - **Quarterly Growth**: $135/3 mo — Includes 2 trainer consults, guest passes, group classes.
    - **Half-Yearly Pro**: $240/6 mo (Most Popular) — 24/7 access, personal locker, 3D body scans, 4 trainer sessions.
    - **Yearly Elite**: $420/yr (Best Value, Save 30%) — VIP all-inclusive, 8 personal trainer sessions, free merchandise.
  - Each card features a direct **"Join with [Plan]"** button that pre-selects that plan in the registration wizard!
- **Workout Zones & Training Grid (`<TrainingGrid />`)**:
  - Showcases Heavy Compound Lifting, CrossFit & Battle Ropes, Commercial Cardio, Bodybuilding Hypertrophy, Combat Boxing, and Core Calisthenics.
- **Elite Coaching Team (`<TeamSection />`)**:
  - Professional portraits of certified trainers with specialties (Strength, Powerlifting, Nutrition, Mobility).
- **Sticky Glassmorphic Header (`<Navbar />`)**:
  - Logo with glowing Dumbbell branding.
  - Prominent **"Join GymConnect"** primary accent button and **"Sign In"** button for non-logged-in visitors.
  - Authenticated states with Dashboard link, "Complete Registration" alert badge, and Sign Out.

---

### 2. Smart Multi-Unit BMI & Metabolic Calculator (`<BMICalculator />`)
- **Tri-Unit Height Controls**:
  - **Centimeters (`cm`)**: 120 cm to 225 cm slider with instant ft/in and meter conversions.
  - **Feet & Inches (`ft / in`)**: Dedicated dual sliders for Feet (3–7 ft) and Inches (0–11 in) — designed specifically for South Asian & Western standards.
  - **Meters (`meter`)**: 1.20 m to 2.25 m slider with 0.01 precision.
- **Dual Weight Units**: Toggle between **Kilograms (`kg`)** and **Pounds (`lbs`)**.
- **Fitness Goal Engine**:
  - **Fat Loss (Cut)**: Calculates a -500 kcal deficit with higher protein ratios to preserve muscle.
  - **Maintain (Tone)**: Balances exact Total Daily Energy Expenditure (TDEE).
  - **Muscle Gain (Bulk)**: Calibrates a +350 kcal surplus for optimal hypertrophy.
- **5 Physical Activity Multipliers**: From Sedentary to Competitive Athlete.
- **Visual Spectrum Needle Gauge**: Displays a colored spectrum (Underweight, Normal, Overweight, Obese) with a live position pointer indicating the user's score.
- **Clinical Body Fat % Estimate**: Uses the Deurenberg formula based on age, BMI, and gender.
- **Mifflin-St Jeor BMR & TDEE**: Accurate basal metabolic rate and daily calorie expenditure.
- **Personalized Daily Macronutrient Split**: Protein, Carbs, and Fats broken down into grams and calories with visual progress bars.
- **Daily Water Intake Recommendation**: Automatically calculates healthy hydration goals in liters.
- **Ideal Weight Range Benchmark**: Shows the exact healthy weight range for the user's height.

---

### 3. Modern Authentication Experience
- **Sign In (`/auth/signin`)**:
  - Modern split-screen layout with full-bleed fitness athlete imagery and member testimonials.
  - Password visibility toggle (`Eye` / `EyeOff`).
  - "Remember me on this browser" checkbox.
  - **1-Click Admin Demo Auto-Fill**: Auto-fills `admin@gym.com` / `Admin@123` for instant evaluation.
- **Sign Up (`/auth/signup`)**:
  - Dual-column aesthetic with verified membership benefits checklist.
  - **Real-Time Password Strength Meter** (Weak, Fair, Good, Strong) with animated progress bars.
  - Captures plan selection from landing page (`?plan=HALF_YEARLY`) and forwards it to profile registration.

---

### 4. Member Registration Wizard (`/register`)
- A seamless 2-step onboarding wizard:
  - **Step 1: Personal Profile**: Full Name, Phone, Gender, Date of Birth, Full Address, Emergency Contact No. (validated with Zod).
  - **Step 2: Package & Photo**: Pre-selected Membership Plan, Joining Date, and Cloudinary Profile Image upload with immediate drag-and-drop preview.
- Automatically creates the database member profile and links it to the logged-in user.

---

### 5. Interactive Member Portal (Dashboard) (`/dashboard`)
Divided into 4 dedicated tabs:

#### Tab 1: Overview & VIP Member Pass
- **Digital VIP Member Card (`<DigitalMemberCard />`)**:
  - Holographic 3D card with metallic gold/amber accents.
  - Member photo, Full Name, Email, Unique Member Code (`GC-XXXXXXXX`).
  - Plan Badge (`YEARLY ELITE VIP`, `HALF-YEARLY PRO`, etc.), Issue Date, and Expiration Date.
  - Live QR code representation for gym turnstile door scanning.
  - **"Print / Save ID Pass"** button (triggers clean print layout).
- **Daily Water Hydration Tracker**:
  - Real-time progress bar towards 2,500 ml daily goal.
  - 1-click **"+250ml Glass"**, **"+500ml Bottle"**, and **"Reset"** buttons with instant toast feedback.
- **Live Notice Board**:
  - Real-time announcements from gym management with priority badges (`URGENT`, `HIGH`, `NORMAL`).

#### Tab 2: Workout Routines & Exercise Tracker
- **Curated Workout Splits**:
  - **Push Day**: Chest, Shoulders & Triceps (Bench Press, Incline Dumbbell, Lateral Raises, Tricep Pushdowns).
  - **Pull Day**: Back, Biceps & Rear Delts (Deadlifts, Lat Pulldowns, Cable Rows, Face Pulls, Curls).
  - **Legs & Core Day**: Quads, Hamstrings & Calves (Barbell Squats, Leg Press, Hamstring Curls, Lunges).
  - **HIIT Cardio Shred**: High-intensity stamina (Treadmill Sprints, Kettlebell Swings, Battle Ropes).
- Each exercise includes Sets, Reps, Rest periods, and Trainer technique tips.
- **1-Click Workout Logger**: Click **"Log Workout Completed Today"** to record your session in the database.

#### Tab 3: Attendance & Consistency Streak
- **"Check In to Gym Today"** button:
  - Validates active membership status.
  - Prevents accidental duplicate check-ins within 8 hours.
  - Displays monthly streak (e.g. 14 days attended this month).
- Verified attendance history table with exact timestamps and entry notes.

#### Tab 4: Payments & Receipts
- Current subscription status and renewal price.
- **"Submit New Payment" Modal**:
  - Select from **bKash**, **Nagad**, or **Bank Wire Transfer**.
  - Displays merchant numbers / bank account details with 1-click copy buttons.
  - Form to enter amount and Transaction ID (TxnID).
- Comprehensive payment history table with status badges (`Approved`, `Pending`, `Rejected`).

---

### 6. Admin Control Center & Operations (`/admin/*`)
- **Executive Dashboard (`/admin/dashboard`)**:
  - High-level KPIs: Total Members, Active Members, Pending Approvals, Inactive Members.
  - Revenue analytics: Total verified earnings and monthly revenue breakdown.
  - Today's gym check-ins and recent registration activity feed.
- **Members Registry (`/admin/members`)**:
  - Multi-parameter filter (by Status, Plan, Gender).
  - Debounced search across name, email, and phone.
  - 1-Click member approval and profile deletion with confirmation.
  - **1-Click Export to CSV**: Downloads `gymconnect-members-YYYY-MM-DD.csv` for spreadsheets.
- **Payment Verification Portal (`/admin/payments`)**:
  - Filter by payment status (`PENDING`, `APPROVED`, `REJECTED`) and method.
  - Modal to verify transaction ID, inspect amount, approve or reject with custom administrative notes.
  - **1-Click Export to CSV**: Downloads `gymconnect-payments-YYYY-MM-DD.csv`.
- **User & Staff Management (`/admin/users`)**:
  - Create new Admin users.
  - Toggle user account active status (suspend/reactivate).
  - Change user roles between `MEMBER` and `ADMIN`.

---

## 🛠️ How Frontend Connects to Backend API

All API communication is centralized in [`src/lib/api.ts`](file:///c:/Users/moshf/OneDrive/Documents/GYM-MANAGEMENT/gymconnect-frontend/src/lib/api.ts):
- **Base URL**: Configured via `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:5000/api/v1`).
- **Credentials**: `withCredentials: true` ensures authentication cookies are preserved.
- **Request Interceptor**: Automatically attaches `Bearer <token>` from localStorage if present.
- **Response Interceptor**:
  - On `401 Unauthorized`: Clears localStorage and redirects the user to `/auth/signin` without reload loops.
  - Extracts clean, human-readable error messages from Zod or backend error structures.

---

## 🗺️ Routing Table & Page Structure

| Route | Access Level | Description |
|---|---|---|
| `/` | Public | Main landing page (Hero, How-To-Join, Pricing, BMI Calculator, Trainers, Footer) |
| `/auth/signin` | Public (Unauthenticated) | Member & Admin sign in with demo credentials auto-fill |
| `/auth/signup` | Public (Unauthenticated) | New member account creation with live password strength meter |
| `/register` | Protected (Logged-in) | 2-step Member Profile & Package Registration Wizard |
| `/dashboard` | Protected (Member) | Full member portal (VIP Card, Workouts, Attendance, Payments, Water Tracker) |
| `/payment` | Protected (Member) | Dedicated checkout & payment instructions flow |
| `/admin/dashboard` | Protected (Admin only) | Executive KPI stats, revenue charts, and quick overview |
| `/admin/members` | Protected (Admin only) | Member registry, search, filters, approval, and CSV export |
| `/admin/payments` | Protected (Admin only) | Payment verification portal, TxnID check, and CSV export |
| `/admin/users` | Protected (Admin only) | User role management, active toggle, and admin user creation |

---

## ⚙️ Local Setup & Development

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root of `gymconnect-frontend`:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
pnpm build
pnpm start
```
