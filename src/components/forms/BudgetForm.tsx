"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import { getCurrentMonth, getCurrentYear, formatCurrency } from "@/lib/utils";

interface BudgetFormProps {
  currentBudget: number;
  onBudgetUpdate: () => void;
}

export function BudgetForm({ currentBudget, onBudgetUpdate }: BudgetFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(currentBudget.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          month: getCurrentMonth(),
          year: getCurrentYear(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update budget");
      }

      onBudgetUpdate();
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        {currentBudget > 0 ? "Edit Budget" : "Set Budget"}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Set Monthly Budget"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-danger-50 text-danger-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <Input
              label="Budget Amount (Rs.)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter your monthly budget"
              min="0"
              step="100"
              required
            />
            {currentBudget > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                Current budget: {formatCurrency(currentBudget)}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
