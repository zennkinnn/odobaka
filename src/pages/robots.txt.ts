import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site?.toString() ?? import.meta.env.SITE_URL ?? 'https://replace-me.example.com';

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', baseUrl)}`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
