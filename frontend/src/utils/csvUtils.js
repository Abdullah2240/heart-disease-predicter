export function exportPredictionsCSV(rows) {
  const headers = [
    'age','sex','cp','trestbps','chol','fbs','restecg','thalach','exang','oldspeak','slope','ca','thal',
    'prediction','probability','timestamp'
  ]
  const csv = [headers.join(',')]
  for (const r of rows) {
    const line = headers.map((h) => r[h]).join(',')
    csv.push(line)
  }
  const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'predictions.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
