import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentMonth, getCurrentYear } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get("months") || "6");

    const currentMonth = getCurrentMonth();
    const currentYear = getCurrentYear();

    const data = [];

    for (let i = 0; i < months; i++) {
      let month = currentMonth - i;
      let year = currentYear;

      if (month <= 0) {
        month += 12;
        year -= 1;
      }

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

      // Get expenses
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      const expenses = await prisma.expense.aggregate({
        where: {
          userId: session.user.id,
          date: { gte: startDate, lt: endDate },
        },
        _sum: { amount: true },
      });

      data.push({
        month,
        year,
        budget: budget?.amount || 0,
        expenses: expenses._sum.amount || 0,
      });
    }

    // Reverse to show oldest first
    data.reverse();

    return NextResponse.json({ comparison: data });
  } catch (error) {
    console.error("Get comparison error:", error);
    return NextResponse.json(
      { error: "Failed to generate comparison" },
      { status: 500 }
    );
  }
}
