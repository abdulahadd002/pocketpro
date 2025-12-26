"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { CategoryBreakdown } from "@/types";

interface ExpenseChartProps {
  data: CategoryBreakdown[];
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No expense data to display
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category.name,
    value: item.amount,
    color: item.category.color,
    percentage: item.percentage,
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, payload }) => `${name}: ${payload?.percentage || 0}%`}
            labelLine={{ stroke: "#6b7280", strokeWidth: 1 }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            formatter={(value) => (
              <span className="text-sm text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
