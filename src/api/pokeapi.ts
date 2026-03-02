import type { PokemonListItem, PokemonDetail, RawPokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

const STAT_MAX: Record<string, number> = {
  hp: 255,
  attack: 190,
  defense: 250,
  'special-attack': 194,
  'special-defense': 250,
  speed: 200,
};

function getIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, '').split('/');
  return parseInt(parts[parts.length - 1], 10);
}

function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/official-artwork/${id}.png`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseDetail(data: any): PokemonDetail {
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.map((t: any) => t.type.name as string),
    abilities: data.abilities.map((a: any) => a.ability.name as string),
    stats: data.stats.map((s: any) => ({
      name: s.stat.name as string,
      value: s.base_stat as number,
      maxValue: STAT_MAX[s.stat.name] ?? 255,
    })),
    sprite: data.sprites?.front_default ?? '',
    artworkUrl: data.sprites?.other?.['official-artwork']?.front_default ?? getSpriteUrl(data.id),
  };
}

// ── Full name index (fetched once, cached in memory) ──────────────────────────
let allNamesCache: { name: string; url: string }[] | null = null;

async function getAllPokemonNames(): Promise<{ name: string; url: string }[]> {
  if (allNamesCache) return allNamesCache;
  const res = await fetch(`${BASE_URL}/pokemon?limit=2000&offset=0`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon index');
  const data: RawPokemonListResponse = await res.json();
  allNamesCache = data.results;
  return allNamesCache;
}

// ── Fetch a single Pokémon's card data (sprite + types) ───────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchCardData(name: string, url: string): Promise<PokemonListItem> {
  const id = getIdFromUrl(url);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();
    return {
      name,
      url,
      id,
      sprite: data.sprites?.other?.['official-artwork']?.front_default ?? getSpriteUrl(id),
      types: data.types.map((t: any) => t.type.name as string),
    };
  } catch {
    return { name, url, id, sprite: getSpriteUrl(id), types: [] };
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function fetchPokemonList(offset: number, limit = 20): Promise<PokemonListItem[]> {
  const res = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon list');
  const data: RawPokemonListResponse = await res.json();

  const details = await Promise.all(
    data.results.map((item) => fetchCardData(item.name, item.url))
  );
  return details;
}

export async function fetchPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!res.ok) throw new Error(`Pokémon "${nameOrId}" not found`);
  const data = await res.json();
  return parseDetail(data);
}

/**
 * Prefix search: filters the full cached name list by `query` (case-insensitive),
 * then fetches card data for the first `limit` matches.
 */
export async function searchByPrefix(query: string, limit = 24): Promise<PokemonListItem[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const allNames = await getAllPokemonNames();

  const matches = allNames
    .filter((p) => p.name.startsWith(q))
    .slice(0, limit);

  if (matches.length === 0) return [];

  // Fetch card data in parallel (already limited to `limit`)
  const results = await Promise.all(
    matches.map((m) => fetchCardData(m.name, m.url))
  );
  return results;
}
