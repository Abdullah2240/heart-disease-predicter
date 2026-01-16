import { useState } from 'react'
import Navbar from './components/Navbar'
import PredictionForm from './components/PredictionForm'
import Visualization from './components/Visualization'
import DatasetSummary from './components/DatasetSummary'
import ModelInfo from './components/ModelInfo'
import CSVExport from './components/CSVExport'
import { parseDataset } from './utils/dataUtils'

export default function App() {
  const [dataset, setDataset] = useState(null)
  const [summary, setSummary] = useState(null)
  const [chartsData, setChartsData] = useState(null)
  const [predictions, setPredictions] = useState([])

  const handleDatasetUpload = async (file) => {
    const { rows, splits, stats, charts } = await parseDataset(file)
    setDataset(rows)
    setSummary({ splits, stats })
    setChartsData(charts)
  }

  const handleAddPredictionRecord = (record) => {
    setPredictions((prev) => [...prev, record])
  }

  return (
    <div>
      <Navbar />
      <header className="bg-white shadow">
        <div className="container py-6">
          <h1 className="text-2xl font-semibold">Heart Disease Predictive App</h1>
          <p className="text-gray-600">Interact with the ML pipeline: input patient data, get predictions, and explore dataset visualizations.</p>
        </div>
      </header>

      <main className="container space-y-16">
        <section id="input" className="pt-8">
          <h2 className="text-xl font-bold mb-4">User Input for Prediction</h2>
          <PredictionForm onPredicted={handleAddPredictionRecord} />
        </section>

        <section id="visualization" className="pt-8">
          <h2 className="text-xl font-bold mb-4">Visualization</h2>
          <Visualization chartsData={chartsData} onUpload={handleDatasetUpload} />
        </section>

        <section id="summary" className="pt-8">
          <h2 className="text-xl font-bold mb-4">Dataset Summary</h2>
          <DatasetSummary summary={summary} />
        </section>

        <section id="model" className="pt-8">
          <h2 className="text-xl font-bold mb-4">Model Information</h2>
          <ModelInfo />
        </section>

        <section id="export" className="pt-8 mb-16">
          <h2 className="text-xl font-bold mb-4">Download Predictions</h2>
          <CSVExport predictions={predictions} />
        </section>
      </main>

      <footer className="bg-white border-t">
        <div className="container py-6 text-sm text-gray-600">Built with React, Vite, Tailwind, and Recharts.</div>
      </footer>
    </div>
  )
}
