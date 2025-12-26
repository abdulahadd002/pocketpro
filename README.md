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
- **Database**: PostgreSQL with Prisma ORM (Vercel Postgres)
- **Authentication**: NextAuth.js v5
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

## Deployment Guide

### Step 1: Create GitHub Repository

1. Create a GitHub account at https://github.com if you don't have one
2. Install Git from https://git-scm.com/download/win
3. Open terminal in project folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
```

4. Create a new repository at https://github.com/new (name it `pocketpro`)
5. Push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pocketpro.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New..." → "Project"
3. Import your `pocketpro` repository
4. **Important**: Before deploying, set Build Command to:
   ```
   npx prisma generate && npx prisma db push && npm run build
   ```
5. Click "Deploy" (it will fail - that's expected, we need to add the database first)

### Step 3: Create Vercel Postgres Database

1. In Vercel dashboard, go to **Storage** tab
2. Click **"Create Database"** → Select **"Postgres"**
3. Name it `pocketpro-db` and click **"Create"**
4. Click **"Connect to Project"** → Select your pocketpro project
5. This automatically adds `DATABASE_URL` and `DIRECT_URL` to your environment variables

### Step 4: Add Environment Variables

Go to your project → **Settings** → **Environment Variables** and add:

| Name | Value |
|------|-------|
| `AUTH_SECRET` | Generate at https://generate-secret.vercel.app/32 |
| `AUTH_URL` | `https://your-project-name.vercel.app` (get this after first deploy) |

### Step 5: Redeploy

1. Go to **Deployments** tab
2. Click the 3 dots on the latest deployment → **"Redeploy"**
3. Wait for build to complete

### Step 6: Seed the Database

After successful deployment, seed the categories by running locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Login and link project
vercel login
vercel link

# Pull environment variables
vercel env pull .env.local

# Push schema and seed
npx prisma db push
npx tsx prisma/seed.ts
```

### Step 7: Update AUTH_URL

1. Copy your deployment URL (e.g., `https://pocketpro-xyz.vercel.app`)
2. Go to Settings → Environment Variables
3. Update `AUTH_URL` with your actual URL
4. Redeploy one more time

Your app is now live!

---

## Local Development

For local development after setting up Vercel Postgres:

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## Project Structure

```
pocketPro/
├── prisma/
│   ├── schema.prisma      # Database schema (PostgreSQL)
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

- `npm run dev` - Start development server (port 3002)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed default categories
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection URL (from Vercel Postgres) |
| `DIRECT_URL` | Direct PostgreSQL connection URL (from Vercel Postgres) |
| `AUTH_SECRET` | Random secret for NextAuth.js |
| `AUTH_URL` | Your app's URL |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID (optional) |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret (optional) |

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`
6. Add `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` to Vercel environment variables

## Currency

The app uses Pakistani Rupee (PKR / Rs.) as the default currency.

## Default Categories

- Sports (green)
- Outings (blue)
- Food (amber)
- Transport (purple)
- Entertainment (pink)
- Education (cyan)
- Other (gray)

## License

ISC License
