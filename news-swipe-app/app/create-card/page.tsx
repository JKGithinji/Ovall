"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, CreditCard, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function CreateCardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, imageUrl }),
      });

      if (res.ok) {
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
        }
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Swiping</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create a News Card</h1>
            <p className="text-white/70 mb-6">
              Pay $5 to create a custom card for all players to vote on
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your headline"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  maxLength={200}
                  required
                />
                <p className="text-white/50 text-xs mt-1">{title.length}/200</p>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write your article description"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[120px]"
                  maxLength={500}
                  required
                />
                <p className="text-white/50 text-xs mt-1">{description.length}/500</p>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image URL (optional)
                  </span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Preview */}
              {(title || description) && (
                <div className="mt-6 p-4 bg-white/10 rounded-xl">
                  <p className="text-white/60 text-xs mb-2">PREVIEW</p>
                  <div className="bg-white rounded-lg p-4">
                    {imageUrl && (
                      <div className="h-32 bg-gray-200 rounded-lg mb-3" />
                    )}
                    <h3 className="font-bold text-gray-900 mb-2">
                      {title || "Your title here"}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {description || "Your description here"}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !title || !description}
                className="w-full py-3 rounded-xl bg-white text-purple-900 font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {loading ? "Processing..." : "Pay $5 & Create Card"}
              </button>

              <p className="text-white/50 text-xs text-center">
                You will be redirected to Stripe for secure payment
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}