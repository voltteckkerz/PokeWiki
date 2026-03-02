import { useEffect, useRef, useState } from 'react';
import type { PokemonStat } from '../types/pokemon';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'Sp.ATK',
  'special-defense': 'Sp.DEF',
  speed: 'SPD',
};

function getBarColor(pct: number): string {
  if (pct < 30) return 'from-red-500 to-red-400';
  if (pct < 55) return 'from-orange-500 to-yellow-400';
  if (pct < 75) return 'from-yellow-400 to-green-400';
  return 'from-green-500 to-emerald-400';
}

export default function StatBar({ stat }: { stat: PokemonStat }) {
  const [width, setWidth] = useState(0);
  const mounted = useRef(false);
  const pct = Math.min(100, Math.round((stat.value / stat.maxValue) * 100));

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const timer = setTimeout(() => setWidth(pct), 80);
      return () => clearTimeout(timer);
    }
  }, [pct]);

  const barColor = getBarColor(pct);

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* Stat label */}
      <span className="w-16 text-right text-white/40 font-semibold text-xs uppercase tracking-wide flex-shrink-0">
        {STAT_LABELS[stat.name] ?? stat.name}
      </span>

      {/* Stat value */}
      <span className="w-8 text-right font-bold text-white text-sm flex-shrink-0">
        {stat.value}
      </span>

      {/* Bar track */}
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
          role="progressbar"
          aria-valuenow={stat.value}
          aria-valuemin={0}
          aria-valuemax={stat.maxValue}
        />
      </div>

      {/* Max value */}
      <span className="w-8 text-left text-white/25 text-xs flex-shrink-0">
        /{stat.maxValue}
      </span>
    </div>
  );
}
