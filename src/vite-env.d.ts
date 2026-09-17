/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Ikrima backend. Unset means "store data in this browser". */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
