<script setup lang="ts">
import { reactive, ref, onUpdated, onMounted } from 'vue';
import TodoList from "./TodoList.vue";
import CustomSelect from "./CustomSelect.vue";
import { useNotesStore } from "@/stores/notesStore";
import ConfirmModal from "@/components/ConfirmModal.vue";
import type {Note} from "@/models/Note";

const props = defineProps({
  data: {
    type: Object as () => Note,
    required: true,
  }
})

const notesStore = useNotesStore();
const { removeNote } = notesStore;

const showConfirmModal = ref(false);

const handleDeleteNote = () => {
  showConfirmModal.value = true;
};

const handleEditNote = () => {
  navigateTo(`/notes/${props.data.id}`);
};

const deleteNote = () => {
  setTimeout(() => {
    removeNote(props.data.id)
  }, 100)
  showConfirmModal.value = false;
};

const cancelDelete = () => {
  showConfirmModal.value = false;
};

const actionList = reactive<{label: string, handler: Function}[]>([
  {label: 'Редактировать', handler: handleEditNote},
  {label: 'Поделиться', handler: () => {console.log("Поделиться")}},
  {label: 'Удалить', handler: handleDeleteNote}
])

</script>

<template>
  <div class="note-card">
    <div class="note-card__header">
      <h3 class="note-title">{{data.title}}</h3>
      <CustomSelect :options="actionList"/>
    </div>
    <h4>{{ 'TODO' }}</h4>
<!--    <TodoList :data="data.todoList"/>-->
    <ul class="note-card__todo-list">
      <li v-for="todo in data.todoList" :class="{'completed' : todo.isCompleted}">
        <span>{{ todo.text }}</span>
      </li>
    </ul>
    <ConfirmModal
        :show="showConfirmModal"
        title="Удалить заметку"
        message="Вы уверены, что хотите удалить эту заметку?"
        @confirm="deleteNote"
        @cancel="cancelDelete"
    />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
.note-card {
  width: auto;
  min-width: 200px;
  height: auto;

  background-color: color-get(primary, 500);
  border: 1px solid rgba(221, 221, 221, 0.4);
  box-shadow: 4px 4px 15px rgba(25, 19, 55, 0.08);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .note-card__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: auto;
  }

  h4 {
    margin: 10px 0;
    opacity: 0.4;
    font-weight: 200;
  }

  .note-card__todo-list {
    list-style-type: none;
    padding: 0px 10px 0px 0px;
    margin: 0px 0px 20px 0px;

    overflow-y: auto;
    overflow-x: hidden;

    li {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      padding: 8px 20px;

      &:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: black;
        opacity: 0.1;
      }

      &.completed {
        text-decoration: line-through;
      }
    }
  }

  .actions {
    margin-top: auto;
    margin-left: auto;
    button {
      margin-right: 8px;
      padding: 6px 12px;
      background-color: color-get(accent, 400);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;

      font-size: 0.725rem;
      font-weight: 500;

    }

    button:hover {
      background-color: color-get(accent, 300);
    }
  }
}

</style>
