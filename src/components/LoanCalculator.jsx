"use client"

import { useState, useContext } from "react"
import { TransactionContext } from "../context/TransactionContext"
import { Card } from "./ui/Card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function LoanCalculator() {
  const { currency, convertCurrency } = useContext(TransactionContext)

  const [loanDetails, setLoanDetails] = useState({
    principal: 100000,
    interestRate: 10,
    tenure: 12, // months
  })

  const [emiDetails, setEmiDetails] = useState(null)
  const [amortizationSchedule, setAmortizationSchedule] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoanDetails({ ...loanDetails, [name]: Number(value) })
  }

  const calculateEMI = () => {
    const { principal, interestRate, tenure } = loanDetails

    const monthlyRate = interestRate / 12 / 100
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    const totalAmount = emi * tenure
    const totalInterest = totalAmount - principal

    setEmiDetails({
      emi: emi,
      totalAmount: totalAmount,
      totalInterest: totalInterest,
    })

    const schedule = []
    let remainingPrincipal = principal

    for (let month = 1; month <= tenure; month++) {
      const interestForMonth = remainingPrincipal * monthlyRate
      const principalForMonth = emi - interestForMonth
      remainingPrincipal -= principalForMonth

      schedule.push({
        month,
        emi: emi,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: remainingPrincipal > 0 ? remainingPrincipal : 0,
      })
    }

    setAmortizationSchedule(schedule)
  }

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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
          <p className="font-medium">Month {payload[0].payload.month}</p>
          <p className="text-blue-500">Principal: {formatCurrency(payload[0].value)}</p>
          <p className="text-green-500">Interest: {formatCurrency(payload[1].value)}</p>
          <p className="text-gray-500">Balance: {formatCurrency(payload[2].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Loan & EMI Calculator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Loan Amount ({currency})</label>
            <input
              type="number"
              name="principal"
              value={loanDetails.principal}
              onChange={handleChange}
              className="input"
              min="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Interest Rate (% per annum)</label>
            <input
              type="number"
              name="interestRate"
              value={loanDetails.interestRate}
              onChange={handleChange}
              className="input"
              min="0.1"
              max="50"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loan Tenure (months)</label>
            <input
              type="number"
              name="tenure"
              value={loanDetails.tenure}
              onChange={handleChange}
              className="input"
              min="1"
              max="360"
            />
          </div>
        </div>

        <button onClick={calculateEMI} className="btn btn-primary mt-4 w-full">
          Calculate EMI
        </button>
      </Card>

      {emiDetails && (
        <>
          <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">EMI Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly EMI</p>
                <p className="text-2xl font-bold text-blue-500">{formatCurrency(emiDetails.emi)}</p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrency(emiDetails.totalInterest)}</p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-purple-500">{formatCurrency(emiDetails.totalAmount)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Amortization Chart</h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={amortizationSchedule}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: "Month", position: "insideBottomRight", offset: -5 }} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="principal" stroke="#3b82f6" name="Principal" />
                  <Line type="monotone" dataKey="interest" stroke="#10b981" name="Interest" />
                  <Line type="monotone" dataKey="balance" stroke="#6b7280" name="Balance" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="py-2 text-left">Month</th>
                    <th className="py-2 text-right">EMI</th>
                    <th className="py-2 text-right">Principal</th>
                    <th className="py-2 text-right">Interest</th>
                    <th className="py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationSchedule.map((row) => (
                    <tr key={row.month} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2">{row.month}</td>
                      <td className="py-2 text-right">{formatCurrency(row.emi)}</td>
                      <td className="py-2 text-right">{formatCurrency(row.principal)}</td>
                      <td className="py-2 text-right">{formatCurrency(row.interest)}</td>
                      <td className="py-2 text-right">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}