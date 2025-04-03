"use client"

import { useContext, useState } from "react"
import { TransactionContext } from "../context/TransactionContext"
import { ThemeContext } from "../context/ThemeContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs"
import { Card } from "./ui/Card"
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from "lucide-react"
import ExpenseChart from "./ExpenseChart"
import BudgetManager from "./BudgetManager"
import LoanCalculator from "./LoanCalculator"

export default function Dashboard() {
  const {
    getTotalIncome,
    getTotalExpense,
    getBalance,
    currency,
    getExpensesByCategory,
    convertCurrency
  } = useContext(TransactionContext)

  const { isDarkMode } = useContext(ThemeContext)
  const [activeTab, setActiveTab] = useState("overview")

  const formatCurrency = (amount) => {
    const convertedAmount = convertCurrency(amount)
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    return formatter.format(convertedAmount)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
              <h3 className="text-2xl font-bold text-green-500">{formatCurrency(getTotalIncome())}</h3>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expense</p>
              <h3 className="text-2xl font-bold text-red-500">{formatCurrency(getTotalExpense())}</h3>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
              <h3 className={`text-2xl font-bold ${getBalance() >= 0 ? "text-blue-500" : "text-red-500"}`}>
                {formatCurrency(getBalance())}
              </h3>
            </div>
            <DollarSign className={`h-8 w-8 ${getBalance() >= 0 ? "text-blue-500" : "text-red-500"}`} />
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="loans">Loans & EMI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
            <div className="h-80">
              <ExpenseChart />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <BudgetManager />
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <LoanCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}