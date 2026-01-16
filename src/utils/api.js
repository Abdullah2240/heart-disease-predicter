import axios from 'axios'

export async function predict(payload) {
  // Assumes backend at /predict (same origin). Adjust baseURL if needed.
  const res = await axios.post('/predict', payload)
  return res.data // { prediction, probability }
}
