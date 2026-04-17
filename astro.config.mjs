import lit from '@astrojs/lit'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
  site: 'https://lecafeadd.fr/',

  // Generate sitemap (set to "false" to disable)
  sitemap: true,

  // Add renderers to the config
  integrations: [sitemap(), mdx(), lit(), icon()],

  vite: {
    plugins: [tailwindcss()]
  }
})