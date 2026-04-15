/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COINGECKO_API_KEY?: string;
  readonly VITE_COINGECKO_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
