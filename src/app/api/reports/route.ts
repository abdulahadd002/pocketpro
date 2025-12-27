import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentMonth, getCurrentYear, calculatePercentage } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || String(getCurrentMonth()));
    const year = parseInt(searchParams.get("year") || String(getCurrentYear()));

    // Get budget
    const budget = await prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month,
          year,
        },
      },
    });

    // Get expenses for the month
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
    const budgetAmount = budget?.amount || 0;
    const remaining = budgetAmount - totalExpenses;

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
      report: {
        month,
        year,
        budget: budgetAmount,
        totalExpenses,
        remaining,
        categoryBreakdown,
        expenses,
      },
    });
  } catch (error) {
    console.error("Get report error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
