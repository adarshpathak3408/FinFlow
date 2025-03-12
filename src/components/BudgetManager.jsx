"use client"

import { useState, useContext, useEffect } from "react"
import { TransactionContext } from "../context/TransactionContext"
import { Card } from "./ui/Card"
import { AlertTriangle } from "lucide-react"

export default function BudgetManager() {
  const { categories, budgets, setBudget, transactions, currency } = useContext(TransactionContext)

  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
  })

  // Calculate spending for each category
  const calculateSpending = () => {
    const spending = {}

    categories.expense.forEach((category) => {
      spending[category] = transactions
        .filter((t) => t.type === "expense" && t.category === category)
        .reduce((sum, t) => sum + Number(t.amount), 0)
    })

    return spending
  }

  const [spending, setSpending] = useState(calculateSpending())

  // Update spending when transactions change
  useEffect(() => {
    setSpending(calculateSpending())
  }, [transactions])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setNewBudget({ ...newBudget, [name]: value })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!newBudget.category || !newBudget.amount) {
      alert("Please select a category and enter an amount")
      return
    }

    setBudget(newBudget.category, newBudget.amount)

    setNewBudget({
      category: "",
      amount: "",
    })
  }

  // Format currency for display
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })

    return formatter.format(amount)
  }

  // Calculate percentage of budget used
  const calculatePercentage = (spent, budget) => {
    if (!budget) return 0
    return Math.min(100, Math.round((spent / budget) * 100))
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Set Budget Limits</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select name="category" value={newBudget.category} onChange={handleChange} className="select" required>
                <option value="">Select category</option>
                {categories.expense.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Budget Amount ({currency})</label>
              <input
                type="number"
                name="amount"
                value={newBudget.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className="input"
                required
              />
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                Set Budget
              </button>
            </div>
          </div>
        </form>
      </Card>

      <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>

        {Object.keys(budgets).length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No budgets set yet. Set a budget above to start tracking your spending.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(budgets).map(([category, budget]) => {
              const spent = spending[category] || 0
              const percentage = calculatePercentage(spent, budget)
              const isOverBudget = spent > budget

              return (
                <div
                  key={category}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium">{category}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(spent)} of {formatCurrency(budget)}
                      </p>
                    </div>
                    {isOverBudget && (
                      <div className="flex items-center text-red-500">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Over Budget</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${isOverBudget ? "bg-red-500" : "bg-blue-500"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

