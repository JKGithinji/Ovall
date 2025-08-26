# News Swipe App

A mobile-optimized web application where users swipe through news articles, vote on them, and earn points by voting with the majority. Users can also create custom cards for others to vote on using Stripe payments.

## Features

- 📱 **Mobile-Optimized Interface**: Swipeable card interface designed for mobile devices
- 👆 **Swipe or Tap**: Vote by swiping cards left/right or tapping buttons
- 🏆 **Gamification**: Earn points by voting with the majority
- 💳 **Stripe Integration**: Pay to create custom news cards
- 🔐 **Authentication**: Secure user registration and login
- ✨ **Smooth Animations**: Beautiful card animations using Framer Motion
- 📊 **Real-time Scoring**: See your points update instantly

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Animations**: Framer Motion
- **UI Components**: Lucide Icons

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Stripe (Get keys from https://stripe.com/docs/keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Price for creating a card (in cents)
CARD_CREATION_PRICE=500
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed initial articles
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## How to Play

1. **Register/Login**: Create an account or login to start playing
2. **Swipe Cards**: 
   - Swipe right or tap ❤️ to LIKE an article
   - Swipe left or tap ✕ to DISLIKE an article
3. **Earn Points**: 
   - Get 1 point if you vote with the majority
   - No points if you vote with the minority
   - See real-time feedback after each vote
4. **Create Cards**: Click the + button to create custom cards (requires $5 payment via Stripe)

## Stripe Setup

To enable payment functionality:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the Stripe Dashboard
3. Add them to your `.env.local` file
4. For production, use live keys and set up webhook endpoints

### Testing Payments

Use Stripe test card numbers:
- Success: `4242 4242 4242 4242`
- Any future expiry date and any CVC

## Project Structure

```
news-swipe-app/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── login/           # Login page
│   ├── create-card/     # Card creation with Stripe
│   └── page.tsx         # Main swipe interface
├── components/          # React components
│   └── SwipeCard.tsx    # Swipeable card component
├── lib/                 # Utility functions
│   ├── auth.ts         # NextAuth configuration
│   └── prisma.ts       # Prisma client
├── prisma/             
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Seed script
└── types/              # TypeScript types
```

## Database Schema

- **User**: Stores user accounts with points
- **Article**: News articles (system or user-created)
- **Vote**: User votes on articles
- **Payment**: Stripe payment records

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

For production, you'll need:
- A production database (e.g., PostgreSQL)
- Production Stripe keys
- Secure `NEXTAUTH_SECRET`

## License

MIT
