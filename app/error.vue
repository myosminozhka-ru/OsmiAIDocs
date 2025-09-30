<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

useHead({
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  title: "Страница не найдена",
  description: "Приносим извинения, но эту страницу не удалось найти.",
});

const { data: navigation } = await useAsyncData("navigation", () =>
  queryCollectionNavigation("docs"),
);
const { data: files } = useLazyAsyncData(
  "search",
  () => queryCollectionSearchSections("docs"),
  {
    server: false,
  },
);

provide("navigation", navigation);
</script>

<template>
  <UApp>
    <AppHeader />

    <UError :error="error" />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        placeholder="Поиск"
      />
    </ClientOnly>
  </UApp>
</template>
