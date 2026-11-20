import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "GymConnect — Premium Gym, Fitness & Training Management",
  description:
    "Join GymConnect: modern gym equipment, certified personal trainers, flexible membership plans, and personalized workout routines to achieve peak fitness.",
  keywords: [
    "GymConnect",
    "gym",
    "fitness",
    "workout",
    "health",
    "exercise",
    "training",
    "BMI calculator",
    "weight loss",
    "bodybuilding",
  ],
  authors: [{ name: "GymConnect Team" }],
  openGraph: {
    title: "GymConnect — Premium Gym, Fitness & Training Management",
    description:
      "Join GymConnect: modern gym equipment, certified personal trainers, flexible membership plans, and personalized workout routines.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#222222",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
