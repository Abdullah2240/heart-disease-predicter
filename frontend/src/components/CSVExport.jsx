import { exportPredictionsCSV } from '../utils/csvUtils'

export default function CSVExport({ predictions }) {
  const handleDownload = () => {
    if (!predictions || predictions.length === 0) return
    exportPredictionsCSV(predictions)
  }

  const count = predictions?.length || 0

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-gray-700">
          You have made <span className="font-bold text-indigo-600">{count}</span> prediction{count !== 1 ? 's' : ''} this session.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Download all inputs and results as a CSV file for your records.
        </p>
      </div>
      <button
        disabled={count === 0}
        onClick={handleDownload}
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download CSV
      </button>
    </div>
  )
}
