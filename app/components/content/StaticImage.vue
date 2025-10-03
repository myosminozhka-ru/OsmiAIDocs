<template>
  <div class="flex items-center justify-center">
    <NuxtImg :src="image" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string;
}>();
</script>

<style scoped></style>
