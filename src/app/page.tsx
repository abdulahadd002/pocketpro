import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  PieChart,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">PocketPro</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Manage Your Pocket Money{" "}
            <span className="text-primary-600">Like a Pro</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Track your expenses, set budgets, and make informed financial decisions.
            PocketPro helps students take control of their pocket money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Everything You Need to Manage Your Finances
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={Wallet}
            title="Budget Tracking"
            description="Set monthly budgets and track your remaining pocket money in real-time."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Expense Tracking"
            description="Log every expense with categories like sports, outings, food, and more."
          />
          <FeatureCard
            icon={PieChart}
            title="Monthly Reports"
            description="Generate detailed reports and compare spending across different months."
          />
          <FeatureCard
            icon={Shield}
            title="Secure & Private"
            description="Your financial data is secure and private. Only you can access it."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              title="Set Your Budget"
              description="Enter your monthly pocket money amount to start tracking."
            />
            <StepCard
              step={2}
              title="Track Expenses"
              description="Log your expenses as you spend on sports, outings, food, and more."
            />
            <StepCard
              step={3}
              title="View Reports"
              description="See where your money goes and make better spending decisions."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">PocketPro</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PocketPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary-600" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
        {step}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
