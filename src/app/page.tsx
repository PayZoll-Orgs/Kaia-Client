"use client";
import { useAuth } from "@/contexts/AuthContext";
import SPAApp from "@/components/SPAApp";
import LandingPage from "@/app/landing/page";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  // Show SPA for authenticated users, Landing page for non-authenticated
  if (isAuthenticated) {
    return <SPAApp />;
  } else {
    return <LandingPage />;
  }
}
