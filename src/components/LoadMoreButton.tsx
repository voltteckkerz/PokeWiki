import Spinner from './Spinner';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}

export default function LoadMoreButton({ onClick, loading, disabled = false }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center pt-4 pb-10">
      <button
        onClick={onClick}
        disabled={loading || disabled}
        id="load-more-btn"
        aria-label="Load more Pokémon"
        className="
          relative inline-flex items-center gap-2.5
          px-8 py-3.5 rounded-2xl
          bg-[#e74c3c] hover:bg-[#c0392b]
          disabled:bg-white/10 disabled:cursor-not-allowed
          text-white font-bold text-sm tracking-wide
          shadow-lg shadow-[#e74c3c]/25
          hover:shadow-xl hover:shadow-[#e74c3c]/30
          hover:-translate-y-0.5
          active:translate-y-0 active:shadow-md
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-[#e74c3c]/60 focus:ring-offset-2 focus:ring-offset-[#0f0f1a]
        "
      >
        {loading ? (
          <>
            <Spinner size="sm" />
            <span>Loading…</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 4v16m8-8H4" />
            </svg>
            <span>Load More</span>
          </>
        )}
      </button>
    </div>
  );
}
