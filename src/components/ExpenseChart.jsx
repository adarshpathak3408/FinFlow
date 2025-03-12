"use client"

import { useContext, useState } from "react"
import { TransactionContext } from "../context/TransactionContext"
import { ThemeContext } from "../context/ThemeContext"
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function ExpenseChart() {
  const { getExpensesByCategory, currency } = useContext(TransactionContext)
  const { isDarkMode } = useContext(ThemeContext)
  const [chartType, setChartType] = useState("pie")

  const expensesByCategory = getExpensesByCategory()

  // Format data for charts
  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }))

  // Colors for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#F44336",
    "#3F51B5",
    "#009688",
    "#FFC107",
  ]

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-blue-500">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <Tabs value={chartType} onValueChange={setChartType} className="mb-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        </TabsList>
      </Tabs>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-60">
          <p className="text-gray-500 dark:text-gray-400">No expense data to display</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "pie" ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
              <XAxis
                dataKey="name"
                tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }}
                axisLine={{ stroke: isDarkMode ? "#4b5563" : "#9ca3af" }}
              />
              <YAxis
                tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }}
                axisLine={{ stroke: isDarkMode ? "#4b5563" : "#9ca3af" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  )
}

