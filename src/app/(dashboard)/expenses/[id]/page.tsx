"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { Expense } from "@/types";
import { Skeleton } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";

export default function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(`/api/expenses/${id}`);
        if (!response.ok) {
          throw new Error("Expense not found");
        }
        const data = await response.json();
        setExpense(data.expense);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load expense");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="py-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8 text-center">
            <p className="text-danger-600 mb-4">{error || "Expense not found"}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-primary-600 hover:text-primary-700"
            >
              Return to Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-4">
      <ExpenseForm expense={expense} isEditing />
    </div>
  );
}
