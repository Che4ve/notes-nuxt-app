<script setup lang="ts">
import {ref, onUpdated} from 'vue';
import DotsHorizontal from "@/assets/svg/dotsHorizontal.svg";

const elementRef = ref();
const opened = ref(false)

defineProps({
  options: {
      type: Array<{label: string; handler: Function}>,
      required: false,
    }
})

// Закрыть селект при клике вне области
const handleClickOutside = (event: MouseEvent) => {
  if (opened.value && elementRef.value && !elementRef.value.contains(event.target as Node)) {
    opened.value = !opened.value;
  }
};

// Добавляем и удаляем глобальный слушатель
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <div class="custom-select" :class="opened ? 'active' : ''" ref="elementRef">
    <button class='select-button' @click="() => {opened = !opened}">
      <DotsHorizontal/>
    </button>
    <ul class="select-options">
      <li v-for="option in options" @click="() => {option.handler(); opened = !opened}">{{option.label}}</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
.custom-select {
  position: relative;
  width: 50px;
  height: 30px;
  align-content: center;
  .select-button {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: transparent;

    svg {
      height: 100%;
      width: 100%;

      transition: all 0.3s ease;
    }

    &:hover {
      svg {
        transform: scale(1.05);
      }
    }
  }
  .select-options {
    z-index: 5;
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
    list-style-type: none;

    background-color: color-get(primary, 400);
    border: 1px solid color.adjust(color-get(primary, 400), $alpha: 0.1);
    border-radius: 8px;
    box-shadow: 2px 2px 8px rgba(26, 25, 35, 0.05);

    padding: 0px 0px;

    overflow: hidden;

    li {
      background-color: color.scale(color-get(primary), $lightness: -1%);
      padding: 10px 15px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:not(:first-child) {
        border-top: 2px solid color.adjust(color-get(primary, 400), $alpha: 0.5);
      }

      &:hover {
        background-color: color-get(primary, 400);
      }
    }

  }

  &:not(.active) {
    .select-options {
      display: none;
    }
  }
}
</style>