import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { buildHistogramData, featureList, isCategorical } from '../utils/dataUtils'

export default function Visualization({ chartsData, onUpload }) {
  const [feature, setFeature] = useState('age')

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
  }

  const data = useMemo(() => {
    if (!chartsData) return []
    return buildHistogramData(chartsData, feature)
  }, [chartsData, feature])

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Upload Dataset (CSV)</label>
          <input type="file" accept=".csv" onChange={handleFile} className="text-sm" />
          <p className="text-xs text-gray-600 mt-1">Columns required: age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldspeak,slope,ca,thal,num</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Select Feature</label>
          <select value={feature} onChange={(e) => setFeature(e.target.value)} className="border rounded px-3 py-2">
            {featureList.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-gray-600">Upload a dataset to see charts.</div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey={isCategorical(feature) ? 'category' : 'bin'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="noDisease" fill="#16a34a" name="No Disease" />
              <Bar dataKey="disease" fill="#dc2626" name="Disease" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
