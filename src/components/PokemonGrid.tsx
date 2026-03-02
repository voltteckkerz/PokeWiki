import type { PokemonListItem } from '../types/pokemon';
import PokemonCard from './PokemonCard';

interface PokemonGridProps {
  pokemon: PokemonListItem[];
  onSelect: (pokemon: PokemonListItem) => void;
}

export default function PokemonGrid({ pokemon, onSelect }: PokemonGridProps) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4"
      aria-label="Pokémon grid"
    >
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} onClick={onSelect} />
      ))}
    </div>
  );
}
