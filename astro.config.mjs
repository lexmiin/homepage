import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'

export default defineConfig({
  site: 'https://lexunix.me',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'vesper'
      }
    }
  },
  integrations: [react()],
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  })
})
