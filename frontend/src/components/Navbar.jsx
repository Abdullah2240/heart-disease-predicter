export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
      <div className="container flex items-center justify-between py-4">
        <div className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-2xl">❤️</span>
          <span>Heart Disease Predictor</span>
        </div>
        <ul className="flex gap-6 text-sm font-medium">
          <li>
            <a href="#input" className="px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
              Predict
            </a>
          </li>
          <li>
            <a href="#export" className="px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
              Download
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
