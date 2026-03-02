interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

export default function Spinner({ size = 'md', label = 'Loading…' }: SpinnerProps) {
  const dim = sizeMap[size];
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={label}>
      <svg viewBox="0 0 100 100" className={`${dim} pokeball-spin`} aria-hidden="true">
        {/* Top half (red) */}
        <path d="M 50 5 A 45 45 0 0 1 95 50 H 5 A 45 45 0 0 1 50 5 Z" fill="#e74c3c" />
        {/* Bottom half (white) */}
        <path d="M 50 95 A 45 45 0 0 1 5 50 H 95 A 45 45 0 0 1 50 95 Z" fill="#f5f5f5" />
        {/* Center divider */}
        <rect x="5" y="47" width="90" height="6" fill="#2c2c2c" />
        {/* Center circle outer */}
        <circle cx="50" cy="50" r="14" fill="#2c2c2c" />
        {/* Center circle inner */}
        <circle cx="50" cy="50" r="8" fill="#f5f5f5" />
      </svg>
      {size === 'lg' && (
        <span className="text-sm text-white/50 tracking-wide animate-pulse">{label}</span>
      )}
    </div>
  );
}
