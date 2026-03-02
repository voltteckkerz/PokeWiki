import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [value, setValue] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim() === '') {
      onSearch('');
      return;
    }
    debounceRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        {isLoading ? (
          <svg className="w-5 h-5 text-yellow-500 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        )}
      </div>

      <input
        id="pokemon-search"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleClear();
        }}
        placeholder="Search Pokémon by name…"
        aria-label="Search Pokémon by name"
        className="
          w-full pl-12 pr-12 py-3.5 rounded-2xl
          bg-white border border-gray-200 shadow-sm
          text-gray-900 placeholder-gray-400
          text-sm font-medium
          focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/50
          transition-all duration-200
        "
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="
            absolute inset-y-0 right-4 flex items-center
            text-gray-300 hover:text-gray-600 transition-colors
          "
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
