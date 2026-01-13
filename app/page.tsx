"use client";
export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-8 overflow-hidden bg-zinc-50">
      {/* Grainy texture overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
     
      {/* Enhanced blurred background shapes with more variety and smoother animation */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
           style={{ animationDuration: '15s', animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
           style={{ animationDuration: '18s', animationDelay: '4s' }} />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-zinc-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"
           style={{ animationDuration: '12s', animationDelay: '2s' }} />
     
      {/* Content */}
      <div className="relative z-10 max-w-4xl px-4">
        <div className="inline-block mb-6 px-4 py-1.5 bg-emerald-100 rounded-full shadow-sm transition-all duration-300 hover:shadow-md">
          <span className="text-xs font-medium text-emerald-800 tracking-wide">AI-POWERED AGRICULTURE</span>
        </div>
       
        <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-zinc-900 mb-6 animate-fade-in">
          Cropify
        </h1>
       
        <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto mb-8 leading-relaxed font-light animate-fade-in animation-delay-200">
          Early disease detection for healthier crops. Upload an image and let our AI agronomist guide you to the right solution.
        </p>
       
        {/* Added details to help farmers: Key benefits section */}
        <div className="mb-12 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in animation-delay-400">
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-medium text-emerald-700 mb-2">Early Detection</h3>
            <p className="text-sm text-zinc-600">Identify diseases before they spread, saving your harvest and reducing losses.</p>
          </div>
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-medium text-emerald-700 mb-2">Expert Guidance</h3>
            <p className="text-sm text-zinc-600">Get tailored recommendations on treatments, pesticides, and best practices.</p>
          </div>
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-medium text-emerald-700 mb-2">Easy to Use</h3>
            <p className="text-sm text-zinc-600">Supports common crops like rice, wheat, and vegetables with 95% accuracy.</p>
          </div>
        </div>
       
        {/* CTA Button with enhanced hover effects */}
        
        <a
          href="/upload"
          className="inline-flex items-center gap-2 px-6 py-3 m-2 sm:px-8 sm:py-4 bg-zinc-900 text-white rounded-2xl text-base font-medium hover:bg-zinc-800 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer animate-fade-in animation-delay-600"
        >
          Analyze Crop Image
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
        <a
          href="/chat"
          className="inline-flex items-center m-2 gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-green-200 text-black rounded-2xl text-base font-medium hover:bg-green-800 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer animate-fade-in animation-delay-600"
        >
          Ai Argonomist
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
        
        {/* Secondary Links with smoother transitions */}
        <div className="mt-12 sm:mt-16 flex gap-8 justify-center text-sm">
          <a
            className="text-zinc-500 hover:text-emerald-700 transition-colors duration-300 font-light"
          >
            About
          </a>
          <span className="text-zinc-300">•</span>
          <a
            className="text-zinc-500 hover:text-emerald-700 transition-colors duration-300 font-light"
          >
            Demo
          </a>
        </div>
      </div>
     
      {/* Bottom accent with subtle glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent shadow-md" />
    </main>
  );
}