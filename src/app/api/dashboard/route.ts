import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentMonth, getCurrentYear, calculatePercentage } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const month = getCurrentMonth();
    const year = getCurrentYear();

    // Get current budget
    const budget = await prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month,
          year,
        },
      },
    });

    // Get expenses for current month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startDate, lt: endDate },
      },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const currentBudget = budget?.amount || 0;
    const remaining = currentBudget - totalExpenses;

    // Get recent expenses (last 5)
    const recentExpenses = expenses.slice(0, 5);

    // Category breakdown
    const categoryTotals = expenses.reduce((acc, exp) => {
      if (!acc[exp.categoryId]) {
        acc[exp.categoryId] = {
          category: exp.category,
          amount: 0,
          count: 0,
        };
      }
      acc[exp.categoryId].amount += exp.amount;
      acc[exp.categoryId].count += 1;
      return acc;
    }, {} as Record<string, { category: typeof expenses[0]["category"]; amount: number; count: number }>);

    const categoryBreakdown = Object.values(categoryTotals)
      .map((item) => ({
        ...item,
        percentage: calculatePercentage(item.amount, totalExpenses),
      }))
      .sort((a, b) => b.amount - a.amount);

    return NextResponse.json({
      stats: {
        currentBudget,
        totalExpenses,
        remaining,
        recentExpenses,
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
