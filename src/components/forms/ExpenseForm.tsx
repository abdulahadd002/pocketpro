"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { expenseSchema, ExpenseInput } from "@/lib/validations";
import { Category, Expense } from "@/types";
import {
  Trophy,
  MapPin,
  UtensilsCrossed,
  Car,
  Gamepad2,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Trophy,
  MapPin,
  UtensilsCrossed,
  Car,
  Gamepad2,
  BookOpen,
  MoreHorizontal,
};

interface ExpenseFormProps {
  expense?: Expense;
  isEditing?: boolean;
}

export function ExpenseForm({ expense, isEditing = false }: ExpenseFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: expense?.amount || undefined,
      categoryId: expense?.categoryId || "",
      description: expense?.description || "",
      date: expense?.date
        ? new Date(expense.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
  });

  const watchedCategoryId = watch("categoryId");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const category = categories.find((c) => c.id === watchedCategoryId);
    setSelectedCategory(category || null);
  }, [watchedCategoryId, categories]);

  const onSubmit = async (data: ExpenseInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const url = isEditing ? `/api/expenses/${expense?.id}` : "/api/expenses";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(data.amount.toString()),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save expense");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Expense" : "Add New Expense"}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger-50 text-danger-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount */}
          <Input
            label="Amount (Rs.)"
            type="number"
            placeholder="Enter amount"
            min="1"
            step="1"
            error={errors.amount?.message}
            {...register("amount", { valueAsNumber: true })}
          />

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((category) => {
                const Icon = iconMap[category.icon] || MoreHorizontal;
                const isSelected = selectedCategory?.id === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setValue("categoryId", category.id)}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: category.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-danger-500">
                {errors.categoryId.message}
              </p>
            )}
            <input type="hidden" {...register("categoryId")} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400"
              placeholder="What did you spend on?"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Date */}
          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              {isEditing ? "Save Changes" : "Add Expense"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
