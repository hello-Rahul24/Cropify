"use client";
export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center text-center px-8 overflow-hidden bg-zinc-50">
      {/* Grainy texture overlay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Blurred background shapes */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-zinc-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
           style={{ animationDuration: '10s', animationDelay: '2s' }} />
      
      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        <div className="inline-block mb-6 px-4 py-1.5 bg-emerald-100 rounded-full">
          <span className="text-xs font-medium text-emerald-800 tracking-wide">AI-POWERED AGRICULTURE</span>
        </div>
        
        <h1 className="text-7xl font-light tracking-tight text-zinc-900 mb-6">
          Cropify
        </h1>
        
        <p className="text-lg text-zinc-600 max-w-xl mx-auto mb-12 leading-relaxed font-light">
          Early disease detection for healthier crops. Upload an image and let our AI agronomist guide you to the right solution.
        </p>
        
        {/* CTA Button */}
        <a
          href="/analyze"
          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-2xl text-base font-medium hover:bg-zinc-800 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
        >
          Analyze Crop Image
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 7l5 5m0 0l-5 5m5-5H6" 
            />
          </svg>
        </a>
        
        {/* Secondary Links */}
        <div className="mt-16 flex gap-8 justify-center text-sm">
          <a 
            href="/about" 
            className="text-zinc-500 hover:text-zinc-900 transition-colors duration-200 font-light cursor-pointer"
          >
            About
          </a>
          <span className="text-zinc-300">•</span>
          <a 
            href="/demo"
            className="text-zinc-500 hover:text-zinc-900 transition-colors duration-200 font-light cursor-pointer"
          >
            Demo
          </a>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
    </main>
  );
}