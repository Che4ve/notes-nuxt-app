<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Подтвердить",
  },
  message: {
    type: String,
    default: "Вы уверены?",
  },
  confirmText: {
    type: String,
    default: "Подтвердить",
  },
  cancelText: {
    type: String,
    default: "Назад",
  }
});

const emit = defineEmits(["confirm", "cancel"]);

const confirmAction = () => {
  emit("confirm");
};

const cancelAction = () => {
  emit("cancel");
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    cancelAction();
  }
  if (event.key === 'Enter') {
    confirmAction();
  }
};

watch(
    () => props.show,
    (isVisible) => {
      if (isVisible) {
        window.addEventListener("keydown", handleKeydown);
      } else {
        window.removeEventListener("keydown", handleKeydown);
      }
    },
    { immediate: true } // Ensure the watcher runs immediately to handle initial state
);

// Ensure cleanup if the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="cancelAction">
    <div class="modal">
      <h2>{{ title }}</h2>
      <span>{{ message }}</span>
      <div class="actions">
        <button @click="cancelAction" class="cancel-btn">{{cancelText}}</button>
        <button @click="confirmAction" class="confirm-btn">{{confirmText}}</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  height: auto;
  text-align: center;

  h2 {
    margin-bottom: 15px;
  }

  span {
    margin: 15px 20px;
    opacity: 0.6;
    font-size: 1rem;
    text-align: center;
    text-wrap: pretty;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    button {
      margin-inline: 8px;
      padding: 10px 12px;
      min-width: 60px;
      //background-color: color-get(accent, 400);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      width: 100%;

      font-size: 0.725rem;
      font-weight: 500;

      &:hover {
        background-color: color-get(accent, 300);
      }

      &.confirm-btn {
        background-color: rgba(255, 26, 42, 0.9);


        &:hover {
          background-color: rgba(255, 0, 21, 0.95);
        }
      }

      &.cancel-btn {
        background-color: transparent;
        border: 1px solid color-get(primary, 300);
        color: color-get(primary, 100);
        &:hover {
          background-color: color-get(primary, 400);
        }
      }
    }
  }
}
</style>
