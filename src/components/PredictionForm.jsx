import { useState } from 'react'
import { predict } from '../utils/api'

const initial = {
  age: '', sex: '', cp: '', trestbps: '', chol: '', fbs: '', restecg: '', thalach: '', exang: '', oldspeak: '', slope: '', ca: '', thal: ''
}

const numberFields = ["age","trestbps","chol","thalach","oldspeak"]
const selectFields = ["sex","cp","fbs","restecg","exang","slope","ca","thal"]

const options = {
  sex: [
    { label: 'Female (0)', value: 0 },
    { label: 'Male (1)', value: 1 },
  ],
  cp: [
    { label: 'Typical angina (0)', value: 0 },
    { label: 'Atypical angina (1)', value: 1 },
    { label: 'Non-anginal pain (2)', value: 2 },
    { label: 'Asymptomatic (3)', value: 3 },
  ],
  fbs: [
    { label: '<= 120 mg/dl (0)', value: 0 },
    { label: '> 120 mg/dl (1)', value: 1 },
  ],
  restecg: [
    { label: 'Normal (0)', value: 0 },
    { label: 'ST-T abnormality (1)', value: 1 },
    { label: 'LV hypertrophy (2)', value: 2 },
  ],
  exang: [
    { label: 'No (0)', value: 0 },
    { label: 'Yes (1)', value: 1 },
  ],
  slope: [
    { label: 'Upsloping (0)', value: 0 },
    { label: 'Flat (1)', value: 1 },
    { label: 'Downsloping (2)', value: 2 },
  ],
  ca: [
    { label: '0', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
  ],
  thal: [
    { label: 'Normal (3)', value: 3 },
    { label: 'Fixed defect (6)', value: 6 },
    { label: 'Reversible defect (7)', value: 7 },
  ],
}

export default function PredictionForm({ onPredicted }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    for (const key of Object.keys(initial)) {
      if (form[key] === '' || form[key] === null) {
        return `Field \'${key}\' is required.`
      }
    }
    // simple numeric ranges (common sense bounds, adjust as needed)
    const ranges = {
      age: [1, 120], trestbps: [50, 250], chol: [50, 700], thalach: [30, 250], oldspeak: [0, 10]
    }
    for (const k of Object.keys(ranges)) {
      const val = Number(form[k])
      const [min, max] = ranges[k]
      if (isNaN(val) || val < min || val > max) {
        return `${k} must be between ${min} and ${max}.`
      }
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) { setError(v); return }
    setError('')
    setLoading(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k,v]) => [k, Number(v)]))
      const data = await predict(payload)
      setResult(data)
      onPredicted?.({ ...payload, ...data, timestamp: new Date().toISOString() })
    } catch (err) {
      setError('Prediction failed. Ensure backend /predict is available.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {numberFields.map((k) => (
          <div key={k}>
            <label className="block text-sm font-medium mb-1" htmlFor={k}>{k}</label>
            <input id={k} name={k} type="number" required value={form[k]} onChange={handleChange}
              className="w-full border rounded px-3 py-2" />
          </div>
        ))}
        {selectFields.map((k) => (
          <div key={k}>
            <label className="block text-sm font-medium mb-1" htmlFor={k}>{k}</label>
            <select id={k} name={k} required value={form[k]} onChange={handleChange}
              className="w-full border rounded px-3 py-2">
              <option value="">Select</option>
              {options[k].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ))}

        {error && <div className="md:col-span-2 text-red-600">{error}</div>}

        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Predicting…' : 'Predict'}
          </button>
          {result && (
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded text-white ${result.prediction ? 'bg-red-600' : 'bg-green-600'}`}>
                Class: {result.prediction === 1 ? 'Disease' : 'No Disease'}
              </span>
              <div className="w-64">
                <div className="text-xs text-gray-600 mb-1">Probability: {(result.probability*100).toFixed(1)}%</div>
                <div className="w-full bg-gray-200 rounded h-3">
                  <div className={`h-3 rounded ${result.prediction ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.round(result.probability*100)}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
