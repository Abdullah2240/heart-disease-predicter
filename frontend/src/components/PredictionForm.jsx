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

  const fieldLabels = {
    age: 'Age',
    sex: 'Sex',
    cp: 'Chest Pain Type',
    trestbps: 'Resting BP (mmHg)',
    chol: 'Cholesterol (mg/dl)',
    fbs: 'Fasting Blood Sugar',
    restecg: 'Resting ECG',
    thalach: 'Max Heart Rate',
    exang: 'Exercise Angina',
    oldspeak: 'ST Depression',
    slope: 'ST Slope',
    ca: 'Major Vessels (0-3)',
    thal: 'Thalassemia'
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {numberFields.map((k) => (
          <div key={k} className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1.5" htmlFor={k}>
              {fieldLabels[k]}
            </label>
            <input
              step={k === 'oldspeak' ? 0.1 : 1}
              id={k}
              name={k}
              type="number"
              required
              value={form[k]}
              onChange={handleChange}
              placeholder={`Enter ${fieldLabels[k].toLowerCase()}`}
              className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white/70 hover:bg-white transition-colors"
            />
          </div>
        ))}
        {selectFields.map((k) => (
          <div key={k} className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1.5" htmlFor={k}>
              {fieldLabels[k]}
            </label>
            <select
              id={k}
              name={k}
              required
              value={form[k]}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white/70 hover:bg-white transition-colors cursor-pointer"
            >
              <option value="">Select {fieldLabels[k].toLowerCase()}</option>
              {options[k].map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        ))}

        {error && (
          <div className="sm:col-span-2 lg:col-span-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        <div className="sm:col-span-2 lg:col-span-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              '🔍 Predict Heart Disease'
            )}
          </button>
        </div>
      </form>

      {/* Result Card */}
      {result && (
        <div className={`mt-8 p-6 rounded-2xl border-2 ${
          result.prediction
            ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
            : 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Prediction Result</div>
              <div className={`text-3xl font-bold ${
                result.prediction ? 'text-red-700' : 'text-green-700'
              }`}>
                {result.prediction === 1 ? '⚠️ Heart Disease Detected' : '✅ No Heart Disease'}
              </div>
              <div className="text-sm text-gray-500 mt-1">Model accuracy: 92%</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm font-medium text-gray-600 mb-2">Probability</div>
              <div className={`text-4xl font-extrabold ${
                result.prediction ? 'text-red-600' : 'text-green-600'
              }`}>
                {(result.probability * 100).toFixed(1)}%
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.prediction ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.round(result.probability * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
