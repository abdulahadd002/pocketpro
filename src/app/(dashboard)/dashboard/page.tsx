"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Skeleton, Badge } from "@/components/ui";
import { BudgetForm } from "@/components/forms/BudgetForm";
import {
  formatCurrency,
  formatDate,
  formatMonthYear,
  getCurrentMonth,
  getCurrentYear,
  calculatePercentage,
} from "@/lib/utils";
import { DashboardStats, ExpenseWithCategory, CategoryBreakdown } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const currentBudget = stats?.currentBudget || 0;
  const totalExpenses = stats?.totalExpenses || 0;
  const remaining = stats?.remaining || 0;
  const spentPercentage = calculatePercentage(totalExpenses, currentBudget);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            {formatMonthYear(getCurrentMonth(), getCurrentYear())}
          </p>
        </div>
        <div className="flex gap-3">
          <BudgetForm currentBudget={currentBudget} onBudgetUpdate={fetchDashboardData} />
          <Link
            href="/expenses/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Expense
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Monthly Budget"
          value={formatCurrency(currentBudget)}
          icon={Wallet}
          iconBg="bg-primary-100"
          iconColor="text-primary-600"
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          iconBg="bg-warning-50"
          iconColor="text-warning-600"
          subtitle={currentBudget > 0 ? `${spentPercentage}% of budget` : undefined}
        />
        <StatCard
          title="Remaining"
          value={formatCurrency(remaining)}
          icon={PiggyBank}
          iconBg={remaining >= 0 ? "bg-success-50" : "bg-danger-50"}
          iconColor={remaining >= 0 ? "text-success-600" : "text-danger-600"}
          subtitle={remaining < 0 ? "Over budget!" : undefined}
          subtitleColor={remaining < 0 ? "text-danger-600" : undefined}
        />
      </div>

      {/* Budget Progress Bar */}
      {currentBudget > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Budget Usage</span>
              <span className="font-medium">{spentPercentage}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  spentPercentage > 100
                    ? "bg-danger-500"
                    : spentPercentage > 75
                    ? "bg-warning-500"
                    : "bg-success-500"
                }`}
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
              <div className="space-y-4">
                {stats.categoryBreakdown.map((item: CategoryBreakdown) => (
                  <CategoryItem key={item.category.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No expenses recorded yet</p>
                <Link
                  href="/expenses/new"
                  className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-block"
                >
                  Add your first expense
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Link
              href="/reports"
              className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recentExpenses && stats.recentExpenses.length > 0 ? (
              <div className="space-y-3">
                {stats.recentExpenses.map((expense: ExpenseWithCategory) => (
                  <ExpenseItem key={expense.id} expense={expense} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent expenses</p>
                <Link
                  href="/expenses/new"
                  className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-block"
                >
                  Add an expense
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  subtitle,
  subtitleColor,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  subtitle?: string;
  subtitleColor?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-4">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className={`text-xs ${subtitleColor || "text-gray-500"}`}>
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryItem({ item }: { item: CategoryBreakdown }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: item.category.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-900 truncate">
            {item.category.name}
          </span>
          <span className="text-sm font-medium text-gray-900 ml-2">
            {formatCurrency(item.amount)}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.category.color,
            }}
          />
        </div>
      </div>
      <span className="text-xs text-gray-500 w-10 text-right">
        {item.percentage}%
      </span>
    </div>
  );
}

function ExpenseItem({ expense }: { expense: ExpenseWithCategory }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div
          className="w-2 h-8 rounded-full"
          style={{ backgroundColor: expense.category.color }}
        />
        <div>
          <p className="text-sm font-medium text-gray-900">
            {expense.description || expense.category.name}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="default">{expense.category.name}</Badge>
            <span className="text-xs text-gray-500">
              {formatDate(expense.date)}
            </span>
          </div>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-900">
        {formatCurrency(expense.amount)}
      </span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="py-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
