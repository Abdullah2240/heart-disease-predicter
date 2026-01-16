import { useState } from 'react'
import Navbar from './components/Navbar'
import PredictionForm from './components/PredictionForm'
import CSVExport from './components/CSVExport'

export default function App() {
  const [predictions, setPredictions] = useState([])

  const handleAddPredictionRecord = (record) => {
    setPredictions((prev) => [...prev, record])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <header className="py-12 text-center">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">
            Heart Disease Prediction
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter patient data to predict the likelihood of heart disease using our trained ML model.
            Results are instant and you can export all predictions as CSV.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Model trained on the UCI Heart Disease dataset (Cleveland subset). Target: 0 = No Disease, 1 = Disease.
          </p>
        </div>
      </header>

      <main className="container flex-1 space-y-12 pb-16">
        {/* Prediction Form Section */}
        <section id="input" className="card p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">🩺</span> Patient Data Input
          </h2>
          <PredictionForm onPredicted={handleAddPredictionRecord} />
        </section>

        {/* Export Section */}
        <section id="export" className="card p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">📥</span> Download Predictions
          </h2>
          <CSVExport predictions={predictions} />
        </section>
      </main>

      
    </div>
  )
}
