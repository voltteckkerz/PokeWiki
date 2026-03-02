import { useState, useEffect, useCallback } from 'react';
import './index.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PokemonGrid from './components/PokemonGrid';
import PokemonModal from './components/PokemonModal';
import LoadMoreButton from './components/LoadMoreButton';
import Spinner from './components/Spinner';
import { fetchPokemonList, fetchPokemonDetail, searchByPrefix } from './api/pokeapi';
import type { PokemonListItem, PokemonDetail } from './types/pokemon';

const PAGE_SIZE = 20;

export default function App() {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<PokemonListItem[] | null>(null);
  const [searchError, setSearchError] = useState('');

  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        const list = await fetchPokemonList(0, PAGE_SIZE);
        setPokemonList(list);
        setOffset(PAGE_SIZE);
      } catch {
        // silently fail; user sees empty state
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  // Load more (browse mode only)
  const handleLoadMore = useCallback(async () => {
    setLoadMoreLoading(true);
    try {
      const more = await fetchPokemonList(offset, PAGE_SIZE);
      setPokemonList((prev) => [...prev, ...more]);
      setOffset((prev) => prev + PAGE_SIZE);
    } catch {
      // ignore
    } finally {
      setLoadMoreLoading(false);
    }
  }, [offset]);

  // Search handler
  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    setSearchError('');

    if (!q) {
      setSearchResult(null);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchByPrefix(q);
      if (results.length > 0) {
        setSearchResult(results);
        setSearchError('');
      } else {
        setSearchResult([]);
        setSearchError(`No Pokémon found matching "${q}".`);
      }
    } catch {
      setSearchResult([]);
      setSearchError('Something went wrong. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Open modal + fetch detail
  const handleSelectPokemon = useCallback(async (pokemon: PokemonListItem) => {
    setSelectedPokemon(pokemon);
    setPokemonDetail(null);
    setDetailLoading(true);
    try {
      const detail = await fetchPokemonDetail(pokemon.id);
      setPokemonDetail(detail);
    } catch {
      setPokemonDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPokemon(null);
    setPokemonDetail(null);
  }, []);

  const displayList = query ? (searchResult ?? []) : pokemonList;
  const isSearchMode = Boolean(query);
  const totalShown = displayList.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdf0]">
      <Header />

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero / search area */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Explore the <span className="text-yellow-500">Pokédex</span>
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            {!isSearchMode
              ? `Browsing ${totalShown} Pokémon — search by name or load more below`
              : searchResult && searchResult.length > 0
              ? `Found ${totalShown} Pokémon matching "${query}"`
              : searchLoading
              ? 'Searching…'
              : `No results for "${query}"`}
          </p>
          <SearchBar onSearch={handleSearch} isLoading={searchLoading} />
        </div>

        {/* Grid states */}
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner size="lg" label="Loading Pokémon…" />
          </div>
        ) : displayList.length > 0 ? (
          <>
            <PokemonGrid pokemon={displayList} onSelect={handleSelectPokemon} />

            {/* Load More (browse mode only) */}
            {!isSearchMode && (
              <LoadMoreButton
                onClick={handleLoadMore}
                loading={loadMoreLoading}
              />
            )}
          </>
        ) : (
          /* Empty / error state */
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-6xl select-none">🔍</div>
            <p className="text-gray-500 text-base font-medium">
              {searchError || 'No Pokémon found.'}
            </p>
            {isSearchMode && (
              <p className="text-gray-400 text-sm">
                Try a different name (e.g.{' '}
                <span className="text-yellow-500 font-semibold cursor-pointer"
                  onClick={() => handleSearch('char')}>
                  char
                </span>)
              </p>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-300 text-xs border-t border-gray-100">
        Data sourced from{' '}
        <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer"
          className="text-yellow-500 hover:text-yellow-600 transition-colors">
          PokéAPI
        </a>
        . Pokémon and all related names are trademarks of Nintendo.
      </footer>

      {/* Detail modal */}
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          detail={pokemonDetail}
          loading={detailLoading}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
