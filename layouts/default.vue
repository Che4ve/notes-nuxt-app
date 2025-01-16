<script setup lang="ts">
onMounted(() => {
  console.log("Hello, Nebus!");
})
</script>

<template>
  <header>
    <NuxtLink to="/"></NuxtLink>
  </header>
  <main>
    <slot/>
  </main>
</template>

<style scoped>
  header {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>