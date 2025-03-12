"use client"

import { useState, useContext } from "react"
import { TransactionContext } from "../context/TransactionContext"
import { Card } from "./ui/Card"
import { Download, Edit, Trash2, Search, Share2 } from "lucide-react"
import ExpenseSharingModal from "./ExpenseSharingModal"

export default function TransactionList() {
  const { transactions, deleteTransaction, editTransaction, exportTransactions, currency } =
    useContext(TransactionContext)

  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showSharingModal, setShowSharingModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.category.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchTerm)
    )
  })

  // Start editing a transaction
  const startEditing = (transaction) => {
    setEditingId(transaction.id)
    setEditForm({ ...transaction })
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null)
    setEditForm({})
  }

  // Save edited transaction
  const saveEdit = () => {
    editTransaction(editingId, editForm)
    setEditingId(null)
    setEditForm({})
  }

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm({ ...editForm, [name]: value })
  }

  // Open sharing modal for a transaction
  const openSharingModal = (transaction) => {
    setSelectedTransaction(transaction)
    setShowSharingModal(true)
  }

  // Close sharing modal
  const closeSharingModal = () => {
    setShowSharingModal(false)
    setSelectedTransaction(null)
  }

  return (
    <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transaction History</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700"
            />
          </div>
          <button
            onClick={exportTransactions}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Download className="h-4 w-4 mr-1" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="py-2 text-left">Date</th>
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-left">Category</th>
              <th className="py-2 text-right">Amount</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  {editingId === transaction.id ? (
                    // Edit mode
                    <>
                      <td className="py-3">
                        <input
                          type="date"
                          name="date"
                          value={editForm.date.slice(0, 10)}
                          onChange={handleEditChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="text"
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="py-3">
                        <select
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className="w-full p-1 border rounded"
                        >
                          {editForm.type === "expense" ? (
                            <>
                              {[
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
                              ].map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </>
                          ) : (
                            <>
                              {["Salary", "Freelance", "Investments", "Gift", "Other"].map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </>
                          )}
                        </select>
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          name="amount"
                          value={editForm.amount}
                          onChange={handleEditChange}
                          className="w-full p-1 border rounded text-right"
                        />
                      </td>
                      <td className="py-3 text-right">
                        <button onClick={saveEdit} className="text-green-500 hover:text-green-700 mr-2">
                          Save
                        </button>
                        <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700">
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="py-3">{formatDate(transaction.date)}</td>
                      <td className="py-3">{transaction.description}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.type === "expense"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {transaction.category}
                        </span>
                      </td>
                      <td
                        className={`py-3 text-right font-medium ${
                          transaction.type === "expense" ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {transaction.type === "expense" ? "-" : "+"}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => startEditing(transaction)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          aria-label="Edit transaction"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-500 hover:text-red-700 mr-2"
                          aria-label="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {transaction.type === "expense" && (
                          <button
                            onClick={() => openSharingModal(transaction)}
                            className="text-purple-500 hover:text-purple-700"
                            aria-label="Share expense"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showSharingModal && selectedTransaction && (
        <ExpenseSharingModal transaction={selectedTransaction} onClose={closeSharingModal} />
      )}
    </Card>
  )
}

