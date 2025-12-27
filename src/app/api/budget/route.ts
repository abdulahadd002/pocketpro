import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { budgetSchema } from "@/lib/validations";
import { getCurrentMonth, getCurrentYear } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const month = getCurrentMonth();
    const year = getCurrentYear();

    const budget = await prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month,
          year,
        },
      },
    });

    return NextResponse.json({ budget });
  } catch (error) {
    console.error("Get budget error:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = budgetSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const { amount, month, year } = validatedData.data;

    const budget = await prisma.budget.upsert({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month,
          year,
        },
      },
      update: { amount },
      create: {
        userId: session.user.id,
        amount,
        month,
        year,
      },
    });

    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    console.error("Set budget error:", error);
    return NextResponse.json(
      { error: "Failed to set budget" },
      { status: 500 }
    );
  }
}
