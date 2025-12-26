"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency, getMonthName } from "@/lib/utils";

interface MonthData {
  month: number;
  year: number;
  budget: number;
  expenses: number;
}

interface ComparisonChartProps {
  data: MonthData[];
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Not enough data for comparison
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: `${getMonthName(item.month).substring(0, 3)} ${item.year}`,
    Budget: item.budget,
    Expenses: item.expenses,
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(value) => `Rs.${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />
          <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
