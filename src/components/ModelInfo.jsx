export default function ModelInfo() {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-sm space-y-2">
      <p>
        We trained Linear Regression and other classification models on the UCI Heart Disease dataset
        (processed Cleveland subset). The target is binary: 0 = no disease, 1 = disease.
      </p>
      <p>
        The dataset includes features: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang,
        oldspeak, slope, ca, thal. The pipeline performs preprocessing, scaling, and class balancing.
      </p>
      <p>
        This frontend calls a backend endpoint /predict with user-provided feature values and displays
        the predicted class and probability.
      </p>
    </div>
  )
}
