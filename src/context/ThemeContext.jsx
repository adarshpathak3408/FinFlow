"use client"

import { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext()

const THEMES = {
  light: {
    name: "light",
    colors: {
      primary: "#3b82f6",
      secondary: "#10b981",
    },
  },
  dark: {
    name: "dark",
    colors: {
      primary: "#3b82f6",
      secondary: "#10b981",
    },
  },
  blue: {
    name: "blue",
    colors: {
      primary: "#2563eb",
      secondary: "#0891b2",
    },
  },
  green: {
    name: "green",
    colors: {
      primary: "#059669",
      secondary: "#0d9488",
    },
  },
  purple: {
    name: "purple",
    colors: {
      primary: "#7c3aed",
      secondary: "#8b5cf6",
    },
  },
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("light")

  // Load theme preferences from localStorage on initial render
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode")
    const storedTheme = localStorage.getItem("theme")

    if (storedDarkMode !== null) {
      setIsDarkMode(storedDarkMode === "true")
    } else {
      // Check user's system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)
    }

    if (storedTheme) {
      setCurrentTheme(storedTheme)
    }
  }, [])

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    localStorage.setItem("darkMode", isDarkMode)
  }, [isDarkMode])

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("theme", currentTheme)

    // Apply theme colors to CSS variables
    const theme = THEMES[currentTheme]
    if (theme) {
      document.documentElement.style.setProperty("--primary", theme.colors.primary)
      document.documentElement.style.setProperty("--secondary", theme.colors.secondary)
    }
  }, [currentTheme])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  const setTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        currentTheme,
        setTheme,
        availableThemes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

