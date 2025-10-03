<template>
  <div
    class="mx-auto page-width-wide:mx-0 w-full decoration-primary/6 print:break-inside-avoid max-w-3xl page-width-wide:max-w-screen-2xl page-api-block:ml-0 flex flex-row gap-3 justify-center"
  >
    <div
      class="relative overflow-hidden after:block after:absolute after:-inset-0 after:pointer-events-none w-fit"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
