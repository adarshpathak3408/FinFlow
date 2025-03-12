"use client"

import { useState, useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { Sun, Moon, Menu, X, DollarSign } from "lucide-react"
import ThemeSelector from "./ThemeSelector"
import CurrencySelector from "./CurrencySelector"

export default function Navbar() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold">ExpenseTracker</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSelector />
            <CurrencySelector />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <ThemeSelector isMobile={true} />
            <CurrencySelector isMobile={true} />
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium">Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

