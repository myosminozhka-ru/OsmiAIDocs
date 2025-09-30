// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no",
        },
        {
          name: "format-detection",
          content: "email=no",
        },
        {
          name: "apple-mobile-web-app-title",
          content: "OsmiAI",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/my-favicon/favicon-96x96.png",
          sizes: "96x96",
        },
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/my-favicon/favicon.svg",
        },
        {
          rel: "shortcut icon",
          href: "/my-favicon/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/my-favicon/apple-touch-icon.png",
        },
        {
          rel: "manifest",
          href: "/my-favicon/site.webmanifest",
        },
      ],
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "nuxt-og-image",
  ],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
    preview: {
      api: "https://api.nuxt.studio",
    },
  },

  compatibilityDate: "2024-07-11",

  nitro: {
    prerender: {
      routes: ["/"],
      crawlLinks: true,
      autoSubfolderIndex: false,
    },
  },
  routeRules: {
    "/": { redirect: "/getting-started" },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  icon: {
    provider: "iconify",
  },
});
