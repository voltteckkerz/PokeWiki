import { useEffect, useCallback, useState } from 'react';
import type { PokemonListItem, PokemonDetail } from '../types/pokemon';
import TypeBadge from './TypeBadge';
import Spinner from './Spinner';

interface PokemonModalProps {
  pokemon: PokemonListItem | null;
  detail: PokemonDetail | null;
  loading: boolean;
  onClose: () => void;
}

// Type → gradient hero colors (top of modal)
const TYPE_HERO_GRADIENT: Record<string, string> = {
  normal:   'from-[#9B9B9B] to-[#C5C5C5]',
  fire:     'from-[#FF6B35] to-[#FFA040]',
  water:    'from-[#4A90D9] to-[#74B4F0]',
  electric: 'from-[#F7D02C] to-[#FFE566]',
  grass:    'from-[#74B14C] to-[#9ACD6A]',
  ice:      'from-[#5BC8E4] to-[#88D8E8]',
  fighting: 'from-[#C03028] to-[#E05048]',
  poison:   'from-[#A040A0] to-[#C060C0]',
  ground:   'from-[#C09B5C] to-[#D8BF88]',
  flying:   'from-[#7090D8] to-[#9AA9E8]',
  psychic:  'from-[#F85888] to-[#FC8AA8]',
  bug:      'from-[#74A438] to-[#94BC4A]',
  rock:     'from-[#B8A038] to-[#D4C058]',
  ghost:    'from-[#705898] to-[#9878B8]',
  dragon:   'from-[#4838C0] to-[#6050F0]',
  dark:     'from-[#3D2E2A] to-[#6A5248]',
  steel:    'from-[#8888A0] to-[#B8B8D0]',
  fairy:    'from-[#EE70AC] to-[#FFB0D0]',
};

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defence',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

const TOTAL_BLOCKS = 15;

function StatBlocks({ value, maxValue }: { value: number; maxValue: number }) {
  const filled = Math.round((value / maxValue) * TOTAL_BLOCKS);
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
        <div
          key={i}
          className={`h-4 w-4 rounded-sm transition-all duration-300 ${
            i < filled
              ? 'bg-yellow-400'
              : 'bg-gray-200'
          }`}
          style={{ transitionDelay: `${i * 30}ms` }}
        />
      ))}
    </div>
  );
}

type Tab = 'stats' | 'about';

export default function PokemonModal({ pokemon, detail, loading, onClose }: PokemonModalProps) {
  const [tab, setTab] = useState<Tab>('stats');

  useEffect(() => {
    setTab('stats');
  }, [pokemon]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!pokemon) return null;

  const primaryType = pokemon.types[0] ?? 'normal';
  const heroGradient = TYPE_HERO_GRADIENT[primaryType] ?? 'from-gray-400 to-gray-300';
  const paddedId = String(pokemon.id).padStart(3, '0');
  const artworkSrc = detail?.artworkUrl ?? pokemon.sprite;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.18s ease-out' }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${pokemon.name}`}
    >
      <div className="modal-slide-up w-full sm:max-w-sm mx-auto overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl bg-white">

        {/* ─── Hero gradient top ─── */}
        <div className={`relative bg-gradient-to-b ${heroGradient} pt-5 pb-24`}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 mb-2">
            <button
              onClick={onClose}
              aria-label="Go back"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 transition-colors text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-white/90 font-bold tracking-widest text-sm">#{paddedId}</span>
            <button aria-label="Favourite" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 transition-colors text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Artwork – positioned to overflow into the white card */}
          <div className="flex justify-center">
            <img
              src={artworkSrc}
              alt={pokemon.name}
              className="w-44 h-44 object-contain drop-shadow-2xl relative z-10"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
              }}
            />
          </div>
        </div>

        {/* ─── White content card (overlaps the hero) ─── */}
        <div className="-mt-16 relative z-20 bg-white rounded-t-3xl pt-5 pb-8 modal-scroll overflow-y-auto max-h-[60vh]">
          {/* Name + types */}
          <div className="text-center px-6 mb-1">
            <h2 className="text-2xl font-extrabold capitalize text-gray-900 tracking-tight">
              {pokemon.name.replace(/-/g, ' ')}
            </h2>
            {detail && (
              <p className="text-xs text-gray-400 font-medium mt-0.5">Pokémon #{detail.id}</p>
            )}
            <div className="flex justify-center gap-2 mt-2">
              {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 mt-4 px-6 gap-6">
            {(['about', 'stats'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? 'text-gray-900 border-yellow-400'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {t === 'about' ? 'About' : 'Stats'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-6 mt-5">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner size="md" label="Loading…" />
              </div>
            ) : !detail ? (
              <p className="text-center text-gray-400 py-8 text-sm">Could not load details.</p>
            ) : tab === 'about' ? (
              /* ── About tab ── */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-4 text-center">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Height</div>
                    <div className="text-xl font-bold text-gray-900">
                      {(detail.height / 10).toFixed(1)}<span className="text-sm font-normal text-gray-400"> m</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-4 text-center">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Weight</div>
                    <div className="text-xl font-bold text-gray-900">
                      {(detail.weight / 10).toFixed(1)}<span className="text-sm font-normal text-gray-400"> kg</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Abilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {detail.abilities.map((ab) => (
                      <span key={ab} className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold capitalize border border-yellow-200">
                        {ab.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ── Stats tab ── */
              <div className="space-y-4">
                {detail.stats.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="w-16 text-xs font-bold text-gray-400 uppercase tracking-wide flex-shrink-0 text-right">
                      {STAT_LABELS[s.name] ?? s.name}
                    </span>
                    <span className="w-8 text-sm font-extrabold text-gray-800 text-right flex-shrink-0">
                      {s.value}
                    </span>
                    <StatBlocks value={s.value} maxValue={s.maxValue} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
