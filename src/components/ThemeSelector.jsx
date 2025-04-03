"use client"

import { useTheme } from "../context/ThemeContext"
import { Moon, Sun } from "lucide-react"

export default function ThemeSelector({ isMobile = false }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={isMobile ? "px-2" : ""}>
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
          isMobile ? "w-full justify-start" : ""
        }`}
        aria-label={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-gray-700" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-300" />
        )}
        {isMobile && (
          <span className="text-sm font-medium">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        )}
      </button>
    </div>
  )
}