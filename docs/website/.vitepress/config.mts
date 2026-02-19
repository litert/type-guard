import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "@litert/typeguard",
  description: "An easy and powerful data validation code generator by JavaScript.",
  base: '/projects/typeguard.js/',
  sitemap: {
    hostname: 'https://litert.org/projects/typeguard.js/'
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/guides/quick-start' },
      { text: 'API Reference', link: '/guides/api-reference' },
      { text: 'Syntax Reference', link: '/guides/syntax-guide/' },
    ],

    sidebar: [
      {
        text: 'Guides',
        items: [
          { text: 'Catalog', link: '/guides' },
          { text: 'Quick Start', link: '/guides/quick-start' },
          { text: 'API Reference', link: '/guides/api-reference' },
        ]
      },
      {
        text: 'Syntax Reference',
        items: [
          { text: 'Catalog', link: '/guides/syntax-guide/' },
          { text: 'Rule Forms Overview', link: '/guides/syntax-guide/rule-forms' },
          { text: 'Built-in Types', link: '/guides/syntax-guide/built-in-types' },
          { text: 'Literal Rules', link: '/guides/syntax-guide/literal-rules' },
          { text: 'Collection and Structural Types', link: '/guides/syntax-guide/collection-and-structural' },
          { text: 'Modifiers', link: '/guides/syntax-guide/modifiers' },
          { text: 'String Assertions', link: '/guides/syntax-guide/string-assertions' },
          { text: 'Numeric Filters', link: '/guides/syntax-guide/numeric-filters' },
          { text: 'Syntax Sugar', link: '/guides/syntax-guide/syntax-sugar' },
          { text: 'Custom Types', link: '/guides/syntax-guide/custom-types' },
          { text: 'Examples', link: '/guides/syntax-guide/examples' },
        ]
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/litert/type-guard' }
    ]
  }
})
