"use client"

import { createContext, useState, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

export const TransactionContext = createContext()

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investments", "Gift", "Other"],
  expense: [
    "Food",
    "Housing",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Other",
  ],
}

const CURRENCY_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
}

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([])
  const [currency, setCurrency] = useState("INR")
  const [budgets, setBudgets] = useState({})
  const [loading, setLoading] = useState(true)

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions")
    const storedCurrency = localStorage.getItem("currency")
    const storedBudgets = localStorage.getItem("budgets")

    if (storedTransactions) setTransactions(JSON.parse(storedTransactions))
    if (storedCurrency) setCurrency(storedCurrency)
    if (storedBudgets) setBudgets(JSON.parse(storedBudgets))

    setLoading(false)
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("transactions", JSON.stringify(transactions))
      localStorage.setItem("currency", currency)
      localStorage.setItem("budgets", JSON.stringify(budgets))
    }
  }, [transactions, currency, budgets, loading])

  // Add a new transaction
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: uuidv4(),
      ...transaction,
      date: transaction.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    setTransactions([newTransaction, ...transactions])

    // Check budget alerts
    if (transaction.type === "expense") {
      checkBudgetAlert(transaction.category, transaction.amount)
    }
  }

  // Delete a transaction
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id))
  }

  // Edit a transaction
  const editTransaction = (id, updatedTransaction) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction,
      ),
    )
  }

  // Get total income
  const getTotalIncome = useCallback(() => {
    return transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((acc, transaction) => acc + Number(transaction.amount), 0)
  }, [transactions])

  // Get total expense
  const getTotalExpense = useCallback(() => {
    return transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, transaction) => acc + Number(transaction.amount), 0)
  }, [transactions])

  // Get balance
  const getBalance = useCallback(() => {
    return getTotalIncome() - getTotalExpense()
  }, [getTotalIncome, getTotalExpense])

  // Get expenses by category
  const getExpensesByCategory = useCallback(() => {
    const expensesByCategory = {}

    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        if (!expensesByCategory[transaction.category]) {
          expensesByCategory[transaction.category] = 0
        }
        expensesByCategory[transaction.category] += Number(transaction.amount)
      })

    return expensesByCategory
  }, [transactions])

  // Set budget for a category
  const setBudget = (category, amount) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: Number(amount),
    }))
  }

  // Check if a category is over budget
  const checkBudgetAlert = (category, amount) => {
    if (!budgets[category]) return false

    const totalSpent =
      transactions
        .filter((t) => t.type === "expense" && t.category === category)
        .reduce((acc, t) => acc + Number(t.amount), 0) + Number(amount)

    if (totalSpent > budgets[category]) {
      // Show alert
      alert(`Budget Alert: You've exceeded your budget for ${category}!`)
      return true
    }

    return false
  }

  // Convert amount to selected currency
  const convertCurrency = (amount, from = "INR", to = currency) => {
    if (from === to) return amount

    // Convert to base currency (INR) first if needed
    const amountInINR = from === "INR" ? amount : amount / CURRENCY_RATES[from]

    // Convert from INR to target currency
    return to === "INR" ? amountInINR : amountInINR * CURRENCY_RATES[to]
  }

  // AI-based category detection
  const detectCategory = (description) => {
    description = description.toLowerCase()

    const categoryKeywords = {
      Food: ["food", "restaurant", "zomato", "swiggy", "pizza", "burger", "meal", "lunch", "dinner", "breakfast"],
      Shopping: ["amazon", "flipkart", "myntra", "shopping", "purchase", "buy", "store", "mall", "clothes"],
      Entertainment: ["movie", "netflix", "amazon prime", "disney", "hotstar", "theatre", "concert", "game"],
      Transportation: ["uber", "ola", "taxi", "bus", "train", "metro", "fuel", "petrol", "diesel", "gas"],
      Utilities: ["electricity", "water", "gas", "internet", "wifi", "broadband", "bill", "recharge"],
      Healthcare: ["doctor", "hospital", "medicine", "medical", "health", "clinic", "pharmacy"],
      Education: ["school", "college", "university", "course", "class", "tuition", "book", "stationery"],
      Travel: ["hotel", "flight", "booking", "trip", "vacation", "holiday", "travel"],
    }

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => description.includes(keyword))) {
        return category
      }
    }

    return "Other"
  }

  // Export transactions as CSV
  const exportTransactions = () => {
    const headers = ["Date", "Type", "Category", "Amount", "Description"]

    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          new Date(t.date).toLocaleDateString(),
          t.type,
          t.category,
          t.amount,
          `"${t.description.replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `expense-tracker-export-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        editTransaction,
        getTotalIncome,
        getTotalExpense,
        getBalance,
        getExpensesByCategory,
        categories: CATEGORIES,
        currency,
        setCurrency,
        currencyRates: CURRENCY_RATES,
        convertCurrency,
        budgets,
        setBudget,
        checkBudgetAlert,
        detectCategory,
        exportTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

