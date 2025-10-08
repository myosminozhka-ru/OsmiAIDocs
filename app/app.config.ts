export default defineAppConfig({
  ui: {
    colors: {
      primary: "violet",
      neutral: "slate",
    },
    footer: {
      slots: {
        root: "border-t border-default",
        left: "text-sm text-muted",
      },
    },
  },
  seo: {
    siteName: "Osmi AI - Визуально создает агентов с искусственным интеллектом",
  },
  header: {
    title: "",
    to: "/",
    logo: {
      alt: "Osmi",
      light: "/img/logo-white.png",
      dark: "/img/logo-dark.png",
    },
    search: true,
    colorMode: true,
    links: [
      {
        icon: "i-simple-icons-github",
        to: "https://github.com/myosminozhka-ru/StartAI/tree/translation",
        target: "_blank",
        "aria-label": "GitHub",
      },
    ],
  },
  footer: {
    credits: `Osmi AI • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [
      {
        icon: "i-simple-icons-facebook",
        to: "https://www.facebook.com/Myosminozhka.ru/",
        target: "_blank",
        "aria-label": "Osmi on facebook",
      },
      {
        icon: "i-simple-icons-telegram",
        to: "https://t.me/osmi_it",
        target: "_blank",
        "aria-label": "Osmi on Telegram",
      },
      {
        icon: "i-simple-icons-github",
        to: "https://github.com/myosminozhka-ru/StartAI/tree/translation",
        target: "_blank",
        "aria-label": "Osmi on GitHub",
      },
    ],
  },
  toc: {
    title: "Содержание",
    bottom: {
      title: "Полезные ссылки",
      edit: "https://github.com/nuxt-ui-templates/docs/edit/main/content",
      links: [
        {
          icon: "i-lucide-book-open",
          label: "Markdown Syntax",
          to: "https://v3.docs-template-3erl.pages.dev/essentials/markdown-syntax",
          target: "_blank",
        },
      ],
    },
  },
});
