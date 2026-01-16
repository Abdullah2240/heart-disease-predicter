import { exportPredictionsCSV } from '../utils/csvUtils'

export default function CSVExport({ predictions }) {
  const handleDownload = () => {
    if (!predictions || predictions.length === 0) return
    exportPredictionsCSV(predictions)
  }
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <button
        disabled={!predictions || predictions.length === 0}
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Download CSV (Inputs + Predictions)
      </button>
      <p className="text-xs text-gray-600 mt-2">Captures all prediction requests made in this session.</p>
    </div>
  )
}
