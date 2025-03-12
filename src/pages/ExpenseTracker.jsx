"use client"
import Dashboard from "../components/Dashboard"
import TransactionForm from "../components/TransactionForm"
import TransactionList from "../components/TransactionList"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { TransactionProvider } from "../context/TransactionContext"
import { ThemeProvider } from "../context/ThemeContext"

export default function Home() {
  return (
    <ThemeProvider>
      <TransactionProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Personal Expense Tracker</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Dashboard />
              </div>
              <div>
                <TransactionForm />
              </div>
            </div>
            <div className="mt-8">
              <TransactionList />
            </div>
          </main>
          <Footer />
        </div>
      </TransactionProvider>
    </ThemeProvider>
  )
}

