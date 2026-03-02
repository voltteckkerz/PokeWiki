export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-yellow-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        {/* Pokéball logo */}
        <svg viewBox="0 0 100 100" className="w-9 h-9 flex-shrink-0" aria-hidden="true">
          <path d="M 50 5 A 45 45 0 0 1 95 50 H 5 A 45 45 0 0 1 50 5 Z" fill="#e74c3c" />
          <path d="M 50 95 A 45 45 0 0 1 5 50 H 95 A 45 45 0 0 1 50 95 Z" fill="#f8f8f8" />
          <rect x="5" y="47" width="90" height="6" fill="#1a1a1a" />
          <circle cx="50" cy="50" r="13" fill="#1a1a1a" />
          <circle cx="50" cy="50" r="7" fill="#f8f8f8" />
        </svg>

        {/* Brand */}
        <div className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            Poké<span className="text-[#e74c3c]">Wiki</span>
          </span>
          <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
            Pokémon Explorer
          </span>
        </div>

        <div className="flex-1" />

        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-xs text-yellow-700 font-semibold">
          Powered by PokéAPI
        </span>
      </div>
    </header>
  );
}
