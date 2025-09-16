"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page
    router.push("/landing");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center mx-auto mb-4"> 
          <span className="font-bold text-white">Z</span>
        </div>
        <p className="text-lg">Redirecting to ZenCrypto...</p>
      </div>
    </div>
  );
}
