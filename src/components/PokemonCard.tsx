// Type-to-background for card tint
const TYPE_CARD_BG: Record<string, string> = {
  normal:   'bg-gray-100  border-gray-200',
  fire:     'bg-orange-50  border-orange-200',
  water:    'bg-blue-50    border-blue-200',
  electric: 'bg-yellow-50  border-yellow-300',
  grass:    'bg-green-50   border-green-200',
  ice:      'bg-cyan-50    border-cyan-200',
  fighting: 'bg-red-50     border-red-200',
  poison:   'bg-purple-50  border-purple-200',
  ground:   'bg-amber-50   border-amber-200',
  flying:   'bg-indigo-50  border-indigo-200',
  psychic:  'bg-pink-50    border-pink-200',
  bug:      'bg-lime-50    border-lime-200',
  rock:     'bg-yellow-100 border-yellow-300',
  ghost:    'bg-violet-50  border-violet-200',
  dragon:   'bg-blue-100   border-blue-300',
  dark:     'bg-gray-200   border-gray-400',
  steel:    'bg-slate-100  border-slate-300',
  fairy:    'bg-rose-50    border-rose-200',
};

import type { PokemonListItem } from '../types/pokemon';
import TypeBadge from './TypeBadge';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onClick: (pokemon: PokemonListItem) => void;
}

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const primaryType = pokemon.types[0] ?? 'normal';
  const cardBg = TYPE_CARD_BG[primaryType] ?? 'bg-gray-50 border-gray-200';
  const paddedId = String(pokemon.id).padStart(3, '0');

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View details for ${pokemon.name}`}
      onClick={() => onClick(pokemon)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(pokemon)}
      className={`
        group relative flex flex-col items-center
        rounded-2xl overflow-hidden cursor-pointer
        border ${cardBg}
        hover:scale-[1.04] hover:shadow-xl hover:shadow-black/10
        active:scale-[0.98]
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-yellow-400/70
        select-none bg-white
      `}
    >
      {/* ID badge */}
      <div className="w-full flex justify-end px-3 pt-2">
        <span className="text-[10px] font-bold text-gray-300 tracking-widest">#{paddedId}</span>
      </div>

      {/* Artwork */}
      <div className="w-full flex justify-center px-6 pt-0 pb-2">
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          loading="lazy"
          className="w-28 h-28 object-contain drop-shadow-md group-hover:-translate-y-1 transition-transform duration-200"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
          }}
        />
      </div>

      {/* Type tinted bottom strip */}
      <div className={`w-full ${cardBg.split(' ')[0]} px-4 py-2 text-center`}>
        <h2 className="text-sm font-bold capitalize text-gray-800 tracking-wide truncate mb-1.5">
          {pokemon.name.replace(/-/g, ' ')}
        </h2>
        <div className="flex flex-wrap justify-center gap-1 pb-1">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>
      </div>
    </article>
  );
}
