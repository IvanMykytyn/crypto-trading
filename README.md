# Crypto trading

A small **crypto trading** UI backed by **CoinGecko**—search coins, open a detail page with **EUR** pricing and an **intraday** chart, then place **paper** buys and sells (simulation). **My orders** ties full history to **portfolio P/L** (average cost vs live quotes). Your simulated wallet is saved in **localStorage**, so balances and orders survive a refresh.

**Live demo:** [https://crypto-trading-cmd.netlify.app](https://crypto-trading-cmd.netlify.app)

**Features demo:** [loom video](https://www.loom.com/share/153f195d3b504f71a068028c98069f3b)

---

## Running locally

**Prerequisites:** Node.js (LTS), [pnpm](https://pnpm.io/installation) (version is pinned in `package.json`).

If you don’t have pnpm yet: run **`corepack enable`** (comes with Node), then use the `pnpm` commands below—Corepack will install the pinned version.

Or install globally: **`npm install -g pnpm`** (preferred).

```bash
cd cmd-test-prject
pnpm install
```

Copy env and add your CoinGecko **demo** API key (see [authentication](https://docs.coingecko.com/reference/authentication)):

```bash
cp .env.example .env
# edit .env — set VITE_COINGECKO_API_KEY
```

```bash
pnpm dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

| Command         | Use case                      |
| --------------- | ----------------------------- |
| `pnpm build`    | Typecheck + production bundle |
| `pnpm preview`  | Serve that bundle locally     |
| `pnpm test`     | Vitest in watch mode          |
| `pnpm test:run` | Vitest once (CI / pre-push)   |
| `pnpm lint`     | ESLint                        |
| `pnpm format`   | Prettier                      |

---

## What’s in the app

- **Dashboard** — **trending** coins (same data as an empty navbar search), up to **five recently viewed** coins (updated when you open a detail page), and a **top 100** table from CoinGecko **`/coins/markets`** (EUR).
- **Coin details** — live EUR quote, 24h PnL line from CoinGecko, Recharts intraday chart, trade panel, per-coin order history.
- **My orders** — full order list, EUR balance, positions table with **unrealized P/L** (average cost from order history vs live prices).
- **Search** (navbar) — trending or text search, navigate to a coin.

Trades update **Redux** only (no backend): EUR balance, orders, and the **recently viewed** list are persisted with **redux-persist** to **localStorage** under a fixed key. Open position sizes and average cost are **recomputed from orders** so the store stays a single source of truth for history.

---

## Requirements coverage

| Area         | Approach                                                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **State**    | **Redux Toolkit** for wallet domain (orders, EUR). **TanStack Query** for remote coin data (cache, refetch, errors).                                                                                         |
| **Charting** | **Recharts** area chart on the coin page (EUR, 1d).                                                                                                                                                          |
| **Data**     | **CoinGecko** REST (`/coins`, `/simple/price`, `/market_chart`, `/coins/markets`, search + `search/trending`) via a small axios client.                                                                      |
| **Errors**   | Shared `getRequestErrorMessage` for Axios failures; sensible **Query** retry (skip most 4xx); user-visible messages on coin page (details, spot price, chart), trade panel, portfolio prices, navbar search. |
| **Styling**  | **Tailwind CSS v4** (layout, utilities) plus **Mantine** for inputs, shell, modals, and buttons so forms stay consistent without rebuilding primitives.                                                      |

---

## Implementation notes

1. **Redux vs React Query** — Redux holds durable **client** state (orders, EUR). React Query owns **server** state (API responses, loading, errors). That split avoids persisting API payloads and keeps refetch logic standard.
2. **Persisted slice shape** — `orders`, `profile.eurBalance`, and **`recent`** (last five coin views for the dashboard) are written to localStorage. **Positions** (quantities + average cost) are **derived** from chronological orders, so replays stay consistent and migrations stay simple.
3. **API typing** — CoinGecko responses are typed narrowly where the UI reads them; unused fields from the raw JSON are omitted to keep types honest.
4. **Charts & bundle** — Recharts is code-split: **lazy** route chunks for pages and a **lazy** `CoinLineChart` import so the first paint on shallow routes stays lighter.
5. **Tests** — **Vitest** (same toolchain as Vite) plus **React Testing Library** for components and pure helpers (e.g. error strings, position replay from orders).

---

## Tech stack (short)

React 19 · Vite 8 · TypeScript · React Router 7 · Redux Toolkit · redux-persist · TanStack Query · Axios · Mantine 9 · Tailwind 4 · Recharts · Vitest
