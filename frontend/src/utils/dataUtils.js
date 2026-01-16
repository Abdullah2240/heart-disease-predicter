import Papa from 'papaparse'

export const featureList = [
  "age","sex","cp","trestbps","chol","fbs","restecg","thalach","exang","oldspeak","slope","ca","thal"
]

export function isCategorical(f) {
  return ["sex","cp","fbs","restecg","exang","slope","ca","thal"].includes(f)
}

export async function parseDataset(file) {
  const rows = await new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: reject,
    })
  })

  // Ensure expected columns, coerce missing types
  for (const r of rows) {
    for (const f of [...featureList, 'num']) {
      if (r[f] === undefined || r[f] === null || r[f] === '') {
        // drop rows with missing data
        r.__drop = true
      }
    }
  }
  const clean = rows.filter((r) => !r.__drop)

  // Shuffle deterministically-ish
  const shuffled = [...clean]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const n = shuffled.length
  const trainEnd = Math.floor(0.6 * n)
  const validEnd = Math.floor(0.8 * n)
  const train = shuffled.slice(0, trainEnd)
  const valid = shuffled.slice(trainEnd, validEnd)
  const test = shuffled.slice(validEnd)

  const splits = {
    train: summarizeSplit(train),
    valid: summarizeSplit(valid),
    test: summarizeSplit(test),
  }

  const stats = {
    overall: computeStats(clean),
  }

  // Precompute charts source: separate by class
  const byClass = {
    disease: clean.filter((r) => Number(r.num) === 1),
    noDisease: clean.filter((r) => Number(r.num) === 0),
  }

  const charts = { byClass }

  return { rows: clean, splits, stats, charts }
}

function summarizeSplit(rows) {
  const counts = { 0: 0, 1: 0 }
  for (const r of rows) {
    const c = Number(r.num)
    counts[c] = (counts[c] || 0) + 1
  }
  return { counts, total: rows.length }
}

function computeStats(rows) {
  const out = {}
  for (const f of featureList) {
    const vals = rows.map((r) => Number(r[f])).filter((v) => !isNaN(v))
    const mean = vals.reduce((a,b) => a+b, 0) / (vals.length || 1)
    const sorted = [...vals].sort((a,b) => a-b)
    const mid = Math.floor(sorted.length/2)
    const median = sorted.length % 2 ? sorted[mid] : ((sorted[mid-1] + sorted[mid]) / 2)
    const variance = vals.reduce((a,b) => a + Math.pow(b - mean, 2), 0) / (vals.length || 1)
    const std = Math.sqrt(variance)
    out[f] = { mean, median, std }
  }
  return out
}

export function buildHistogramData(charts, feature) {
  const { disease, noDisease } = charts.byClass
  if (isCategorical(feature)) {
    const catCounts = {}
    for (const r of noDisease) {
      const k = String(r[feature])
      catCounts[k] = catCounts[k] || { category: k, noDisease: 0, disease: 0 }
      catCounts[k].noDisease += 1
    }
    for (const r of disease) {
      const k = String(r[feature])
      catCounts[k] = catCounts[k] || { category: k, noDisease: 0, disease: 0 }
      catCounts[k].disease += 1
    }
    return Object.values(catCounts).sort((a,b) => a.category.localeCompare(b.category))
  }
  // numeric: create bins
  const vals = [...noDisease.map((r) => Number(r[feature])), ...disease.map((r) => Number(r[feature]))].filter((v) => !isNaN(v))
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const bins = 10
  const width = (max - min) / bins || 1
  const data = []
  for (let i = 0; i < bins; i++) {
    const start = min + i * width
    const end = i === bins-1 ? max : (start + width)
    const label = `${start.toFixed(1)}-${end.toFixed(1)}`
    data.push({ bin: label, noDisease: 0, disease: 0, _start: start, _end: end })
  }
  const place = (arr, key) => {
    for (const r of arr) {
      const v = Number(r[feature])
      const idx = Math.min(Math.floor((v - min) / width), bins - 1)
      data[idx][key] += 1
    }
  }
  place(noDisease, 'noDisease')
  place(disease, 'disease')
  return data.map(({ _start, _end, ...rest }) => rest)
}
