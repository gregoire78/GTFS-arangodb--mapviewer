/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_MAPTILER_KEY: string
    readonly VITE_API: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}