import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'

const copyButtonTransformer = {
  name: 'copy-button',
  root(node) {
    node.children = [
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block'] },
        children: [
          ...node.children,
          {
            type: 'element',
            tagName: 'button',
            properties: {
              className: ['code-copy-button'],
              type: 'button',
              ariaLive: 'polite'
            },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['visually-hidden'] },
                children: [{ type: 'text', value: 'Copy code to clipboard' }]
              }
            ]
          }
        ]
      }
    ]
  }
}

export default defineConfig({
  site: 'https://lexunix.me',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'vesper'
      },
      transformers: [copyButtonTransformer]
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
