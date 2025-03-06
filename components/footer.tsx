export function Footer() {
  return (
    <footer className="bg-gray-100 mt-12 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Disclaimer</h3>
          <p className="text-sm text-gray-600 max-w-3xl mx-auto px-2">
            The ITRA points and athlete information in this table are for informational purposes only. We cannot
            guarantee the accuracy or completeness of the data, as ITRA points may change with additional events. Please
            visit the official ITRA website for the latest information.
          </p>
          <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} VUM Athletes Database. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

