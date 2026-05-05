import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL ?? process.env.URL ?? 'https://replace-me.example.com';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()]
});
