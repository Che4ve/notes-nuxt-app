<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "@/stores/notesStore";
import { storeToRefs } from "pinia";
import { ref, computed, useTemplateRef } from "vue";
import CustomCheckbox from "~/components/CustomCheckbox.vue";
import ConfirmModal from "~/components/ConfirmModal.vue";

// Доступ к маршруту и маршрутизатору
const route = useRoute();
const router = useRouter();

// Получаем id из параметров маршрута
const noteId = String(route.params.id);

// Работа с хранилищем
const notesStore = useNotesStore();
const { notes } = storeToRefs(notesStore);
const { getNoteById, updateNote } = notesStore;

// Найти заметку по id
const note = computed(() => getNoteById(noteId));

// Локальные данные для редактирования
const title = ref(note.value?.title || "");
const todoList = ref(note.value?.todoList.map((todo) => ({ ...todo })) || []);

const showCancelModal = ref(false);

const todoListContainerRef = useTemplateRef("todoListContainerRef");
const addTodoButtonRef = useTemplateRef("addTodoButtonRef");

// Сохранение изменений
const saveChanges = () => {
  if (note.value) {
    updateNote({
      id: noteId,
      title: title.value,
      todoList: todoList.value.filter((note) => note.text.length > 0),
    });
    router.push("/"); // Возвращаемся на главную страницу после сохранения
  }
};

// Добавление новой задачи
const addTodo = async () => {
  todoList.value.push({
    id: Date.now().toString(),
    text: "",
    isCompleted: false,
  });

  await nextTick();

  if (addTodoButtonRef) {
    const element = addTodoButtonRef.value as HTMLElement;
    setTimeout(() => {
      if (element.parentElement) {
        element.parentElement.scrollTop = element.parentElement.scrollHeight;
      }
    }, 300)
  }
};

// Удаление задачи
const deleteTodo = (todoId: string) => {
  todoList.value = todoList.value.filter((todo) => todo.id !== todoId);
};

const handleCancel = () => {
  showCancelModal.value = true;
}

const cancelEditing = () => {
  showCancelModal.value = false;
  router.back()
}

</script>

<template>
  <div class="edit-note">
    <h1>Редактирование заметки</h1>

    <label for="title">Название</label>
    <input
      id="title"
      type="text"
      v-model="title"
      placeholder="Введите название заметки"
    />

    <div class="edit-note__todo-header">
      <h2>Список дел</h2>
      <button
        @click="
          () => {
            todoList = [];
          }
        "
      >
        Очистить
      </button>
    </div>

    <transition-group name="todo-list" tag="ul" ref="todoListRef">
      <li v-for="todo in todoList" :key="`todo-${todo.id}`">
        <CustomCheckbox
          v-model="todo.isCompleted"
        />
        <input
          type="text"
          v-model="todo.text"
          placeholder="Введите задачу"
        />
        <button @click="deleteTodo(todo.id)">Удалить</button>
      </li>
      <li :key="'todo-list__add-button'" ref="addTodoButtonRef">
        <button class="edit-note__add-todo-button" @click="addTodo">
          Добавить дело
        </button>
      </li>
    </transition-group>

    <div class="edit-note__actions">
      <button @click="saveChanges">Сохранить</button>
      <button @click="handleCancel">Назад</button>
    </div>
  </div>

  <ConfirmModal
      :show="showCancelModal"
      title="Прекратить редактирование?"
      message="Изменения не будут сохранены"
      confirm-text="Выйти"
      cancel-text="Остаться"
      @confirm="cancelEditing"
      @cancel="() => {showCancelModal = false}"
  />
</template>

<style lang="scss" scoped>
.edit-note {
  max-width: 600px;
  margin: auto;
  margin-block: 100px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;

  transition: all 0.4s ease;

  h1 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    text-align: center;
    color: color-get(primary, 0);
  }

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    color: color-get(primary, 100);
  }

  input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid color-get(primary, 400);
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;

    &:focus {
      border-color: color-get(accent, 500);
      outline: none;
      box-shadow: 0 0 4px rgba(color-get(accent, 300), 0.3);
    }
  }

  .todo-list-move,
  .todo-list-enter-active,
  .todo-list-leave-active {
    transition: all 0.5s ease;
  }

  .todo-list-enter-from {
    opacity: 0;
    transform-origin: top;
    transform: scaleY(0.2) translateX(-10px);
  }
  .todo-list-enter-to {
    opacity: 1;
    transform-origin: top;
    transform: scaleY(1);
  }

  .todo-list-leave-from {
    opacity: 1;
    transform: scaleY(1);
  }
  .todo-list-leave-to {
    opacity: 0;
    transform: translateY(-20px) scaleY(0.1);
  }

  .todo-list-leave-active {
    position: absolute;
    width: 100%;
  }

  ul {
    position: relative;
    list-style: none;
    padding: 0;
    margin-bottom: 20px;

    height: 300px;
    overflow-y: auto;
    scroll-behavior: smooth;

    transition: all 0.4s ease;

    li {
      display: flex;
      align-items: stretch;
      justify-content: stretch;
      height: 40px;
      gap: 10px;
      border-radius: 4px;
      background-color: transparent;
      margin-bottom: 10px;

      .custom-checkbox {
        margin: 0;
      }

      button {
        background-color: #ff6666;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 0.9rem;
        cursor: pointer;

        &:hover {
          background-color: #e65555;
        }
      }
    }

    .edit-note__add-todo-button {
      width: 100%;
      height: 100%;
      font-size: 1rem;
      font-weight: 600;
      border: 2px dashed rgba(color-get(primary, 300), 0.3);
      border-radius: 8px;
      background-color: transparent;
      color: color-get(primary, 200);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(color-get(primary, 400), 0.4);
        border-color: rgba(color-get(accent, 500), 0.3);
      }
    }
  }

  .edit-note__todo-header {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
    align-items: center;

    height: 40px;
    margin: 20px 0px 10px 0px;

    h2 {
      color: color-get(primary, 0);
      font-size: 1.325rem;
    }

    button {
      height: 80%;
      padding: 4px 8px;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;

      background-color: transparent;
      border: 1px solid rgba(color-get(accent, 400), 0.5);
      color: rgba(#fb4848, 0.5);

      &:hover {
        background-color: color-get(accent, 300);
        color: white;
      }
    }
  }

  .edit-note__actions {
    display: flex;
    gap: 20px;
    justify-content: space-between;

    button {
      flex: 1;
      padding: 12px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:first-of-type {
        background-color: color-get(accent, 400);
        color: white;

        &:hover {
          background-color: color-get(accent, 300);
        }
      }

      &:last-of-type {
        background-color: color-get(primary, 400);
        color: color-get(primary, 100);

        &:hover {
          background-color: color-get(primary, 300);
        }
      }
    }
  }
}

@media only screen and (max-width: 600px) {
  .edit-note {
    margin-block: 50px;
    border-radius: 0;

    li {
      button:not(.edit-note__add-todo-button) {
        color: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        content: "";

        height: 100%;
        width: 30px;
        background:
            transparent
            url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiPjwvZz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvZz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+IDxwYXRoIGQ9Ik04IDZIMTlDMTkuNTUyMyA2IDIwIDYuNDQ3NzIgMjAgN1YxN0MyMCAxNy41NTIzIDE5LjU1MjMgMTggMTkgMThIOEwyIDEyTDUgOU0xNiA5TDEzLjAwMDEgMTEuOTk5OU0xMy4wMDAxIDExLjk5OTlMMTAgMTVNMTMuMDAwMSAxMS45OTk5TDEwLjAwMDIgOU0xMy4wMDAxIDExLjk5OTlMMTYuMDAwMiAxNSIgc3Ryb2tlPSIjZmY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48L3BhdGg+IDwvZz48L3N2Zz4=")
            center
            no-repeat;

        &:hover {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
