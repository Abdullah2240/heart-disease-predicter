export default function DatasetSummary({ summary }) {
  if (!summary) {
    return <div className="bg-white p-4 rounded-lg shadow text-gray-600">Upload a dataset to view summary.</div>
  }
  const { splits, stats } = summary
  const features = Object.keys(stats.overall)

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-8">
      <div>
        <h3 className="font-semibold mb-2">Counts by Split</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['train','valid','test'].map((s) => (
            <div key={s} className="border rounded p-3">
              <div className="font-medium capitalize mb-2">{s}</div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">No Disease (0)</span>
                <span>{splits[s].counts[0] ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-700">Disease (1)</span>
                <span>{splits[s].counts[1] ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-700">Total</span>
                <span>{splits[s].total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Feature Statistics (Overall)</h3>
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2">Feature</th>
                <th className="text-right px-3 py-2">Mean</th>
                <th className="text-right px-3 py-2">Median</th>
                <th className="text-right px-3 py-2">Std</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f} className="border-t">
                  <td className="px-3 py-2">{f}</td>
                  <td className="px-3 py-2 text-right">{stats.overall[f].mean.toFixed(3)}</td>
                  <td className="px-3 py-2 text-right">{stats.overall[f].median.toFixed(3)}</td>
                  <td className="px-3 py-2 text-right">{stats.overall[f].std.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
