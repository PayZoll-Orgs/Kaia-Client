"use client";
import SPAApp from "@/components/SPAApp";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";

export default function AppPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  // Show SPA for authenticated users
  if (isAuthenticated) {
    return <SPAApp />;
  } else {
    // Redirect to landing if not authenticated
    return (
      <div className="min-h-screen bg-[#FEFEFE] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center mx-auto mb-4"> 
            <span className="font-bold text-white">Z</span>
          </div>
          <p className="text-lg">Please authenticate to access the app</p>
        </div>
      </div>
    );
  }
}
