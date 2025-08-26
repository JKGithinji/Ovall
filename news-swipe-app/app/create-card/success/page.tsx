"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-white/70 mb-6">
          Your card has been created and is now live for all players to vote on.
        </p>
        
        <Link
          href="/"
          className="inline-block bg-white text-purple-900 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
        >
          Back to Swiping
        </Link>
        
        <p className="text-white/50 text-sm mt-4">
          Redirecting in 5 seconds...
        </p>
      </div>
    </div>
  );
}