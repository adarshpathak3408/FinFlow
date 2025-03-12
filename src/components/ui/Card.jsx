import * as React from "react"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 text-gray-950 dark:text-gray-50 shadow-sm ${className}`}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }

