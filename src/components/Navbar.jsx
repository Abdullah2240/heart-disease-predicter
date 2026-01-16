export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="container flex items-center justify-between py-3">
        <div className="font-semibold">Heart Disease Predictor</div>
        <ul className="flex gap-4 text-sm">
          <li><a href="#input" className="hover:underline">Input</a></li>
          <li><a href="#visualization" className="hover:underline">Visualization</a></li>
          <li><a href="#summary" className="hover:underline">Dataset Summary</a></li>
          <li><a href="#model" className="hover:underline">Model Info</a></li>
          <li><a href="#export" className="hover:underline">Download</a></li>
        </ul>
      </div>
    </nav>
  )
}
