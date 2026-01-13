export default function Navbar() {
  return (
    <nav className="relative bg-zinc-50 border-b border-zinc-200">
      {/* Subtle grainy texture */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <a 
          href="/" 
          className="text-xl font-light tracking-tight text-zinc-900 hover:text-emerald-700 transition-colors duration-200"
        >
          Cropify
        </a>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <a
            href="/upload"
            className="px-4 py-2 text-sm font-light text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
          >
            Analyze
          </a>
          <a
            href="/field-analysis"
            className="px-4 py-2 text-sm font-light text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
          >
            Field analysis
          </a>
          <a
            href="/chat"
            className="ml-2 px-5 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-all duration-200 hover:shadow-md"
          >
            AI Agronomist
          </a>
        </div>
      </div>
    </nav>
  );
}