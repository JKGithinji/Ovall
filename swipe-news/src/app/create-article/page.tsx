"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Header } from "@/components/Header"
import { ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import type { Session } from "next-auth"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface ArticleFormData {
  title: string
  content: string
  imageUrl: string
}

function CreateArticleForm() {
  const { data: session } = useSession() as { data: Session | null }
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    content: "",
    imageUrl: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements || !session?.user?.id) {
      toast.error("Payment system not ready")
      return
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in title and content")
      return
    }

    setIsLoading(true)

    try {
      // Create payment intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleTitle: formData.title,
          articleContent: formData.content,
          articleImageUrl: formData.imageUrl,
          userId: session.user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment intent")
      }

      const { clientSecret } = await response.json()

      // Confirm payment
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: session.user.name || "",
            email: session.user.email || "",
          },
        },
      })

      if (error) {
        toast.error(error.message || "Payment failed")
      } else if (paymentIntent.status === "succeeded") {
        toast.success("Article created successfully!")
        router.push("/")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Failed to process payment")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ArticleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Feed
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Article</h1>
            <p className="text-gray-600">
              Create a custom article for users to vote on. Cost: <strong>$5.00</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter article title..."
                maxLength={200}
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Article Content *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Write your article content..."
                maxLength={2000}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.content.length}/2000 characters
              </p>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <CreditCard className="inline mr-2" size={16} />
                Payment Information
              </label>
              <div className="p-4 border border-gray-300 rounded-lg">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !stripe}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              {isLoading ? "Processing..." : "Create Article - $5.00"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function CreateArticlePage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Sign In Required</h1>
            <p className="text-xl text-gray-300">Please sign in to create articles</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CreateArticleForm />
    </Elements>
  )
}