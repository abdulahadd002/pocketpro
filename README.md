# PocketPro - Personal Pocket Money Manager

A full-stack web application for students to manage their pocket money, track expenses, and make informed financial decisions.

## Features

- **Budget Management**: Set and track monthly pocket money budgets
- **Expense Tracking**: Log expenses with categories (Sports, Outings, Food, Transport, Entertainment, Education, Other)
- **Dashboard**: Real-time overview of remaining budget and recent expenses
- **Monthly Reports**: Detailed reports with pie charts and category breakdowns
- **Month Comparison**: Compare spending across different months with bar charts
- **Export**: Download expense reports as CSV files
- **Secure Authentication**: Email/password login with Google OAuth support
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pocketPro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `AUTH_SECRET`: Generate with `openssl rand -base64 32`
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`: (Optional) For Google OAuth

4. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pocketPro/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed default categories
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Authentication pages
│   │   ├── (dashboard)/   # Protected dashboard pages
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── forms/         # Form components
│   │   ├── charts/        # Chart components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utilities and configurations
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript type definitions
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed default categories
- `npm run db:studio` - Open Prisma Studio

## Currency

The app uses Pakistani Rupee (PKR / Rs.) as the default currency.

## Google OAuth Setup (Optional)

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

## Default Categories

The app comes with pre-configured expense categories:
- Sports (green)
- Outings (blue)
- Food (amber)
- Transport (purple)
- Entertainment (pink)
- Education (cyan)
- Other (gray)

## License

ISC License
