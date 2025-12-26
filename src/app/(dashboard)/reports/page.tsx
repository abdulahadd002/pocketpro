"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Skeleton,
  Modal,
} from "@/components/ui";
import { ExpenseChart } from "@/components/charts/ExpenseChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import {
  formatCurrency,
  formatDate,
  formatMonthYear,
  getCurrentMonth,
  getCurrentYear,
  getMonthName,
} from "@/lib/utils";
import { MonthlyReport, ExpenseWithCategory } from "@/types";

interface ComparisonData {
  month: number;
  year: number;
  budget: number;
  expenses: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [comparison, setComparison] = useState<ComparisonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const [reportRes, comparisonRes] = await Promise.all([
        fetch(`/api/reports?month=${month}&year=${year}`),
        fetch("/api/reports/compare?months=6"),
      ]);

      const reportData = await reportRes.json();
      const comparisonData = await comparisonRes.json();

      setReport(reportData.report);
      setComparison(comparisonData.comparison || []);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setIsLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handlePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    const currentMonth = getCurrentMonth();
    const currentYear = getCurrentYear();

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      if (month === 12) {
        setMonth(1);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    }
  };

  const isCurrentMonth = month === getCurrentMonth() && year === getCurrentYear();

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/expenses/${expenseToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchReport();
        setDeleteModalOpen(false);
        setExpenseToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete expense:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    if (!report?.expenses) return;

    const headers = ["Date", "Category", "Description", "Amount"];
    const rows = report.expenses.map((exp) => [
      formatDate(exp.date),
      exp.category.name,
      exp.description || "",
      exp.amount.toString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${getMonthName(month)}-${year}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Report</h1>
          <p className="text-gray-600">View and analyze your spending</p>
        </div>
        <Button variant="outline" onClick={exportToCSV} disabled={!report?.expenses?.length}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Month Selector */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="font-semibold text-lg">
                {formatMonthYear(month, year)}
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={handleNextMonth}
              disabled={isCurrentMonth}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Budget"
          value={formatCurrency(report?.budget || 0)}
          trend={null}
        />
        <SummaryCard
          title="Total Spent"
          value={formatCurrency(report?.totalExpenses || 0)}
          trend={
            report && report.budget > 0
              ? {
                  isPositive: report.totalExpenses <= report.budget,
                  text: `${Math.round((report.totalExpenses / report.budget) * 100)}% of budget`,
                }
              : null
          }
        />
        <SummaryCard
          title="Remaining"
          value={formatCurrency(report?.remaining || 0)}
          trend={
            report
              ? {
                  isPositive: report.remaining >= 0,
                  text: report.remaining >= 0 ? "Under budget" : "Over budget",
                }
              : null
          }
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseChart data={report?.categoryBreakdown || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonChart data={comparison} />
          </CardContent>
        </Card>
      </div>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {report?.expenses && report.expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Description
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.expenses.map((expense: ExpenseWithCategory) => (
                    <tr
                      key={expense.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(expense.date)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: expense.category.color }}
                          />
                          <span className="text-sm text-gray-900">
                            {expense.category.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {expense.description || "-"}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/expenses/${expense.id}`}
                            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => {
                              setExpenseToDelete(expense.id);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No expenses recorded for this month
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        title="Delete Expense"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this expense? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setDeleteModalOpen(false);
              setExpenseToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteExpense}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  trend,
}: {
  title: string;
  value: string;
  trend: { isPositive: boolean; text: string } | null;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div
            className={`flex items-center gap-1 mt-1 text-sm ${
              trend.isPositive ? "text-success-600" : "text-danger-600"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {trend.text}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardContent className="py-4">
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
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
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
