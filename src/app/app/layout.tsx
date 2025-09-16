"use client";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import OnboardingWrapper from "@/components/OnboardingWrapper";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AuthGuard>
        <OnboardingWrapper>
          {children}
        </OnboardingWrapper>
      </AuthGuard>
    </AuthProvider>
  );
}
