/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly PUBLICATION_READY?: string;
  readonly FORGE_URL?: string;
  readonly FORGE_API_TOKEN?: string;
  readonly FORGE_FAQ_ENABLED?: string;
  readonly FORGE_REVIEWS_ENABLED?: string;
  readonly FORGE_ARTICLES_ENABLED?: string;
}
