export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Budget {
  id: string;
  userId: string;
  amount: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  description: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface ExpenseWithCategory extends Expense {
  category: Category;
}

export interface MonthlyReport {
  month: number;
  year: number;
  budget: number;
  totalExpenses: number;
  remaining: number;
  categoryBreakdown: CategoryBreakdown[];
  expenses: ExpenseWithCategory[];
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthComparison {
  current: MonthlyReport;
  previous: MonthlyReport;
  budgetChange: number;
  expenseChange: number;
}

export interface DashboardStats {
  currentBudget: number;
  totalExpenses: number;
  remaining: number;
  recentExpenses: ExpenseWithCategory[];
  categoryBreakdown: CategoryBreakdown[];
}
