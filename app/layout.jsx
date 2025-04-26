import "@/app/globals.css";
import { Inter } from "next/font/google";
import DashFooter from "@/components/DashFooter";
import DashHeader from "@/components/DashHeader";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "GymLense - AI Workout Assistant",
  description: "Your personal AI workout assistant",
};

export default function SignInLayout({ children }) {
  return (
    <html lang="en" className="bg-zinc-900 w-full flex justify-center items-center">
      <body
        className={`antialiased max-w-lg bg-[var(--background)] flex justify-center items-center w-full min-h-[100dvh] relative`}
      >
        <AuthProvider>
          <DashHeader />
          {children}
          <DashFooter />
        </AuthProvider>
      </body>
    </html>
  );
}