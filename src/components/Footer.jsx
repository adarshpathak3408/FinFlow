export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Expense Tracker. All rights reserved.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Developed by Adarshkumar Pathak! Jai Hind</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

