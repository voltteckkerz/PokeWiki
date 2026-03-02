export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  sprite: string;
  types: string[];
}

export interface PokemonStat {
  name: string;
  value: number;
  maxValue: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number; // in decimetres
  weight: number; // in hectograms
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
  sprite: string;
  artworkUrl: string;
}

export interface RawPokemonListResponse {
  count: number;
  next: string | null;
  results: { name: string; url: string }[];
}
