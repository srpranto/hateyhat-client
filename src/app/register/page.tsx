import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a HateyHat account to organize and join community development events.",
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <Suspense fallback={<div className="w-full max-w-md h-96 rounded-3xl bg-card border border-border animate-pulse" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
