import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const budgetSchema = z.object({
  amount: z
    .number()
    .positive("Budget must be a positive amount")
    .max(10000000, "Budget cannot exceed Rs. 10,000,000"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
});

export const expenseSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be a positive number")
    .max(10000000, "Amount cannot exceed Rs. 10,000,000"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  date: z.string().or(z.date()),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
