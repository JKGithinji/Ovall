"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Newspaper } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Invalid email or password");
        } else {
          toast.success("Welcome back!");
          router.push("/");
        }
      } else {
        // Register
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        if (res.ok) {
          toast.success("Account created! Logging you in...");
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
          if (result?.ok) {
            router.push("/");
          }
        } else {
          const error = await res.json();
          toast.error(error.error || "Registration failed");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white/20 p-4 rounded-full mb-4">
            <Newspaper className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">News Swipe</h1>
          <p className="text-white/70 text-center">
            Swipe, vote, and win points!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-purple-900 font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/70 hover:text-white transition-colors"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}