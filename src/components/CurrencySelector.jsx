"use client";

import { useContext } from "react";
import { TransactionContext } from '../context/TransactionContext'
import { DollarSign } from "lucide-react";

export default function CurrencySelector({ isMobile = false }) {
  const { currency, setCurrency, currencyRates } = useContext(TransactionContext);

  const currencies = Object.keys(currencyRates);

  return (
    <div className={isMobile ? "px-2" : ""}>
      <div className={`flex ${isMobile ? "flex-col" : "items-center"} gap-2`}>
        {isMobile && <span className="text-sm font-medium">Currency</span>}
        <div className="flex items-center gap-2">
          {!isMobile && <DollarSign className="h-4 w-4 text-gray-500" />}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md p-1 text-sm"
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}