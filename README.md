# PokéWiki – Pokémon Explorer

A fast, responsive Pokémon explorer built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS v3**, powered by the public [PokéAPI](https://pokeapi.co/).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation & Running

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Features

| Feature               | Description                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Browse Pokémon**    | Loads the first 20 Pokémon on launch with names, images, and type badges                                       |
| **Search by Name**    | Debounced live search queries the PokéAPI by exact name                                                        |
| **Load More**         | Appends the next 20 Pokémon from the API (browse mode only)                                                    |
| **Detail Modal**      | Click any card to open a full detail view with artwork, abilities, height, weight, and animated base stat bars |
| **Responsive Layout** | 2-column grid on mobile → up to 5 columns on wide screens                                                      |
| **Loading States**    | Pokéball spinner during initial load and per-section loading indicators                                        |
| **Error Handling**    | Friendly "No Pokémon found" message with a suggestion on search failure                                        |
| **Accessibility**     | Keyboard navigable cards (Enter/Space), ESC to close modal, ARIA roles and labels throughout                   |

---

## Project Structure

```
src/
├── api/
│   └── pokeapi.ts        # PokéAPI service layer (list, detail, search)
├── components/
│   ├── Header.tsx         # Sticky top navigation bar
│   ├── SearchBar.tsx      # Debounced search input
│   ├── PokemonGrid.tsx    # Responsive card grid
│   ├── PokemonCard.tsx    # Individual Pokémon card
│   ├── PokemonModal.tsx   # Full-detail overlay modal
│   ├── StatBar.tsx        # Animated base stat bar
│   ├── TypeBadge.tsx      # Colored type pill badge
│   ├── LoadMoreButton.tsx # Paginated load trigger
│   └── Spinner.tsx        # Pokéball SVG spinner
├── types/
│   └── pokemon.ts         # TypeScript interfaces for PokéAPI data
├── App.tsx                # Root component with all state management
└── index.css              # Tailwind directives + global custom styles
```

---

## Design & Technical Decisions

### Architecture

- **Client-side only** – No backend required. All data is fetched directly from the PokéAPI at runtime.
- **Separate browse vs. search modes** – Browsing is paginated (offset-based). Searching queries the API by exact Pokémon name. This keeps "Load More" from interfering with search results.
- **Detail fetching on demand** – Detailed stats, abilities, height, and weight are only fetched when a card is clicked, keeping the initial list load lean.

### Styling

- **Tailwind CSS v3** with a dark, premium aesthetic (`#0f0f1a` background), glassmorphism cards, and red (`#e74c3c`) as the primary accent mirroring the classic Pokéball.
- **Per-type color accents** – Each Pokémon card has a subtle gradient tinted to its primary type (18 types mapped to distinct colours).
- **Animated stat bars** – Bars animate from 0% to their target width on mount, with a dynamic gradient colour (red → orange → green) based on the stat percentage.

### Performance

- **`loading="lazy"`** on all card images, letting the browser defer off-screen fetches.
- **Official artwork sprites** from the PokeAPI GitHub CDN (higher quality than default sprites).
- **Fallback image** – If the artwork URL fails, falls back to the standard sprite.

---

## Tech Stack

- [React 19](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Vite 7](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [PokéAPI](https://pokeapi.co/)
