# SwipeNews - Mobile News Voting App

A modern, mobile-optimized web application where users swipe through news articles and earn points by voting with the majority. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

🚀 **Core Functionality**
- Swipe-based interface for news articles (Tinder-like)
- Majority voting system with point rewards
- Real-time score tracking
- Mobile-first responsive design

🔐 **Authentication**
- Google OAuth integration via NextAuth.js
- Secure session management
- User profiles and scores

💳 **Stripe Integration**
- Pay to create custom articles ($5.00)
- Secure payment processing
- Webhook handling for payment confirmation

📰 **News Management**
- Integration with News API for real-time articles
- User-generated paid content
- Article voting and statistics

🎨 **UI/UX**
- Beautiful gradient backgrounds
- Smooth animations with Framer Motion
- Touch-friendly mobile interface
- Engaging swipe interactions

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: NextAuth.js with Google Provider
- **Payments**: Stripe
- **Animations**: Framer Motion
- **News Data**: News API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google OAuth credentials
- Stripe account (for payments)
- News API key (optional)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd swipe-news
   npm install
   ```

2. **Set up environment variables:**
   
   Copy the `.env` file and update with your credentials:
   
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth.js
   NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
   STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
   
   # News API (optional)
   NEWS_API_KEY="your-news-api-key"
   ```

3. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Configuration Guide

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy Client ID and Client Secret to your `.env` file

### Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your publishable and secret keys from the dashboard
3. Set up a webhook endpoint pointing to `/api/webhooks/stripe`
4. Add the webhook secret to your `.env` file

### News API Setup (Optional)

1. Get a free API key from [NewsAPI.org](https://newsapi.org)
2. Add it to your `.env` file
3. The app will work with demo data if no API key is provided

## How It Works

### Voting System

1. Users swipe right (like) or left (dislike) on articles
2. Points are awarded when voting with the majority
3. Majority is determined after at least 3 votes are cast
4. Real-time score updates and notifications

### Article Creation

1. Authenticated users can create custom articles
2. $5.00 payment via Stripe required
3. Articles appear in the feed for other users to vote on
4. Sponsored articles are clearly marked

### Mobile Optimization

- Touch-friendly interface with 44px+ touch targets
- Smooth swipe gestures with visual feedback
- Responsive design for all screen sizes
- Safe area padding for notched devices
- Optimized images with lazy loading

## API Routes

- `GET /api/articles` - Fetch articles for voting
- `POST /api/vote` - Submit a vote for an article
- `GET /api/user/score` - Get current user's score
- `POST /api/create-payment-intent` - Create Stripe payment intent
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## Database Schema

The app uses Prisma with the following main models:

- **User**: Authentication and score tracking
- **Article**: News articles and user-generated content
- **Vote**: User votes on articles
- **Payment**: Stripe payment records

## Deployment

### Production Environment Variables

Make sure to update these for production:

- Use a strong `NEXTAUTH_SECRET`
- Update `NEXTAUTH_URL` to your domain
- Use production Stripe keys
- Consider PostgreSQL for the database

### Recommended Deployment Platforms

- **Vercel**: Optimal for Next.js apps
- **Railway**: Great for full-stack apps with databases
- **Heroku**: Traditional platform with good PostgreSQL support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the GitHub issues
- Review the setup guide
- Ensure all environment variables are set correctly

---

Built with ❤️ using Next.js and modern web technologies.
