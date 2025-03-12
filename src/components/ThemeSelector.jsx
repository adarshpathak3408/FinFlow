"use client"

import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { Palette } from "lucide-react"

export default function ThemeSelector({ isMobile = false }) {
  const { currentTheme, setTheme, availableThemes } = useContext(ThemeContext)

  const themes = Object.entries(availableThemes)

  return (
    <div className={isMobile ? "px-2" : ""}>
      <div className={`flex ${isMobile ? "flex-col" : "items-center"} gap-2`}>
        {isMobile && <span className="text-sm font-medium">Theme</span>}
        <div className="flex items-center gap-2">
          {!isMobile && <Palette className="h-4 w-4 text-gray-500" />}
          <div className="flex gap-1">
            {themes.map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`w-6 h-6 rounded-full border-2 ${
                  currentTheme === key ? "border-blue-500" : "border-transparent"
                }`}
                style={{ backgroundColor: theme.colors.primary }}
                aria-label={`${theme.name} theme`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

