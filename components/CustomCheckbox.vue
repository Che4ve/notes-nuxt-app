<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  }
})

watch(
  () => props.modelValue,
  () => {
    console.log(props.modelValue);
  }
)

const emit = defineEmits(["update:modelValue"]);

</script>

<template>
  <label class="custom-checkbox">
    <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="custom-checkbox__checkmark"></span>
  </label>
</template>

<style lang="scss" scoped>
.custom-checkbox {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0;

  height: 100%;
  width: auto;
  aspect-ratio: 1;
}

.custom-checkbox__checkmark {
  width: 100%;
  height: 100%;
  border: 1px solid color-get(primary, 400);
  display: inline-block;
  border-radius: 3px;
  background:
    color-get(accent)
    url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/White_check.svg/1200px-White_check.svg.png)
    center/1350% no-repeat;
  transition: background-size 0.2s ease;
}

.custom-checkbox input:checked + .custom-checkbox__checkmark {
  background-size: 60%;
  transition: background-size 0.25s cubic-bezier(0.7, 0, 0.18, 1.24);
}

.custom-checkbox input {
  display: none;
}
</style>
