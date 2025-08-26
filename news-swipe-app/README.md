# NewsSwipe - Mobile News Voting App

A mobile-optimized web application where users swipe through current news articles and custom content, vote on whether they like them, and earn points for voting with the majority.

## 🚀 Features

- **Swipeable Cards**: Tinder-style interface optimized for mobile
- **News Integration**: Real-time news articles from News API
- **Voting System**: Users vote by swiping left (dislike) or right (like)
- **Scoring System**: Earn points for voting with the majority
- **Custom Cards**: Users can pay to create custom cards for others to vote on
- **Stripe Integration**: Secure payment processing for custom card creation
- **User Authentication**: Google OAuth integration via NextAuth.js
- **User Dashboard**: View scores, statistics, and voting history
- **Mobile-First Design**: Responsive design optimized for mobile devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Animation**: Framer Motion for smooth interactions
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: SQLite with Prisma ORM
- **Payments**: Stripe for custom card creation
- **News API**: Real-time news data integration
- **Deployment**: Vercel-ready

## 📱 How It Works

1. **Sign In**: Users authenticate via Google OAuth
2. **Swipe to Vote**: Swipe right to like content, left to dislike
3. **Earn Points**: Get points when your vote matches the majority
4. **Create Custom Cards**: Pay $5 to create custom content for others to vote on
5. **Track Progress**: View your score, accuracy, and voting history

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google OAuth credentials
- Stripe account (for payments)
- News API key (optional - falls back to mock data)

### 1. Clone and Install

```bash
git clone <repository-url>
cd news-swipe-app
npm install
```

### 2. Environment Variables

Copy the `.env` file and fill in your credentials:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# News API (optional)
NEWS_API_KEY="your-news-api-key"
```

### 3. Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 🔑 API Keys Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Stripe
1. Create account at [Stripe](https://stripe.com)
2. Get your publishable and secret keys from the dashboard
3. Set up webhook endpoint for payment confirmations
4. Webhook URL: `http://localhost:3000/api/webhook/stripe`

### News API (Optional)
1. Get free API key from [NewsAPI.org](https://newsapi.org)
2. Add to environment variables
3. App falls back to mock data if not provided

## 🎮 Usage

### For Users
1. **Sign in** with Google account
2. **Swipe cards** - right for like, left for dislike
3. **Earn points** when voting with the majority
4. **View dashboard** by clicking on your score
5. **Create custom cards** using the + button (requires payment)

### For Developers
- **Database**: SQLite for development, easily switchable to PostgreSQL for production
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks and context
- **Type Safety**: Full TypeScript coverage
- **API Routes**: RESTful endpoints for all operations

## 📊 Database Schema

- **Users**: Authentication and scoring data
- **Articles**: News articles from API
- **CustomCards**: User-created content
- **Votes**: User voting records
- **Payments**: Stripe payment tracking

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXTAUTH_URL` to your domain
5. Set up Stripe webhook with production URL

### Environment Variables for Production

Update these for production deployment:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="secure-random-string"
```

## 🔧 Development

### Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── lib/                 # Utility functions
└── types/              # TypeScript types

prisma/
├── schema.prisma       # Database schema
└── migrations/         # Database migrations
```

### Key Components

- **SwipeCard**: Individual swipeable card component
- **SwipeStack**: Manages stack of cards with animations
- **CreateCardForm**: Payment form for custom cards
- **UserDashboard**: Statistics and voting history
- **Header**: Navigation and user info

### API Routes

- `/api/auth/[...nextauth]` - Authentication
- `/api/articles` - News articles
- `/api/custom-cards` - User-created cards
- `/api/vote` - Voting and scoring
- `/api/create-payment-intent` - Stripe payments
- `/api/webhook/stripe` - Payment confirmations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@newsswipe.com or open an issue on GitHub.

---

Built with ❤️ using Next.js, React, and modern web technologies.
