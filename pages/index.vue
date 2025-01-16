<script setup lang="ts">
import NoteCard from "@/components/NoteCard.vue";
import CustomModal from "@/components/CustomModal.vue";
import { useNotesStore } from "@/stores/notesStore";
import { storeToRefs } from "pinia";
import { onMounted, onUpdated } from "vue";
import type { Note } from "@/models/Note";
import type { Todo } from "@/models/Todo";
import AddSquare from "@/assets/svg/addSquare.svg";

const notesStore = useNotesStore();
const { notes } = storeToRefs(notesStore);
const { getNoteById, addNote, removeNote } = notesStore;

const initialBlankNote: Readonly<Omit<Note, "id">> = {
  title: "Новая заметка",
  todoList: [],
};

const deepCopy = (obj: Object) => {
  return JSON.parse(JSON.stringify(obj));
};

const showCreateModal = ref(false);
const newNote = reactive<Omit<Note, "id">>(deepCopy(initialBlankNote));

const handleCreateModalOpen = () => {
  console.log("OPENING MODAL");
  showCreateModal.value = true;
};

const handleAddBlankTodo = () => {
  const newTodo: Todo = {
    id: Date.now().toString(),
    text: "",
    isCompleted: false,
    createdAt: new Date(),
  };
  newNote.todoList.push(newTodo);
};

const handleSubmitNewNote = () => {
  newNote.todoList = [...newNote.todoList].filter(
    (note) => note.text.length > 0,
  );
  addNote({ id: Date.now().toString(), ...newNote });
  showCreateModal.value = false;
  handleClearNewNote();
};

const handleClearNewNote = () => {
  Object.assign(newNote, deepCopy(initialBlankNote));
};

const handleRemoveTodo = (id: string) => {
  newNote.todoList = [...newNote.todoList].filter((todo) => todo.id !== id);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && showCreateModal.value) {
    event.preventDefault();
    handleSubmitNewNote();
  }
};

watch(showCreateModal, (isVisible) => {
  if (isVisible) {
    window.addEventListener("keydown", handleKeydown);
  } else {
    window.removeEventListener("keydown", handleKeydown);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <transition-group name="card-board" tag="div" class="card-board">
    <NoteCard v-for="note in notes" :key="`note-${note.id}`" :data="note" />
    <button class="add-note-button" :key="`add-note-button`" @click="handleCreateModalOpen">
      <AddSquare/>
      <span>Добавить заметку</span>
    </button>
  </transition-group>
  <CustomModal v-model:show="showCreateModal">
    <template v-slot:header>
      <input type="text" placeholder="Название" v-model.trim="newNote.title" />
    </template>
    <template v-slot:body>
      <span>Список дел</span>
      <transition-group name="todo-list" tag="ul">
        <li v-for="todo in newNote.todoList" :key="todo.id">
          <input type="text" placeholder="Название" v-model.trim="todo.text"/>
          <button
            class="todo-list__delete-button"
            @click="handleRemoveTodo(todo.id)"
          >
            ×
          </button>
        </li>
        <li :key="'todo-list__add-button'">
          <button class="todo-list__add-button" @click="handleAddBlankTodo">
            + Добавить дело
          </button>
        </li>
      </transition-group>
    </template>
    <template v-slot:footer>
      <button @click="handleClearNewNote">Очистить</button>
      <button @click="handleSubmitNewNote">Сохранить</button>
    </template>
  </CustomModal>
</template>

<style lang="scss" scoped>
@use "sass:color";
.card-board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  grid-auto-rows: 300px;
  align-items: stretch;
  justify-items: stretch;
  gap: 20px;

  width: auto;
  height: auto;
  padding: 50px 50px;

  margin-block: 50px;

  &:before {
    z-index: -1;
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: color-get(primary, 400);
  }

  .card-board-move,
  .card-board-enter-active,
  .card-board-leave-active {
    transition: all 0.5s ease;
  }

  .card-board-enter-from {
    opacity: 0;
    transform-origin: top;
    transform: scaleY(0.2) translateX(-10px);
  }
  .card-board-enter-to {
    opacity: 1;
    transform-origin: top;
    transform: scaleY(1);
  }

  .card-board-leave-from {
    opacity: 1;
    transform: scaleY(1);
  }
  .card-board-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.5);
  }

  .card-board-leave-active {
    transition: all 0.5s ease;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .add-note-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
    outline: none;
    border: 2px dashed rgba(11, 10, 23, 0.3);

    background-color: rgba(9, 25, 27, 0.02);

    cursor: pointer;
    transition:
      all 0.3s ease,
      border-width 0.1s linear;

    svg {
      width: 75px;
      height: 75px;
      opacity: 0.5;
      stroke: black;
      transition: all 0.3s ease;
    }

    span {
      margin-top: 10px;
      font-size: 1.2rem;
      font-weight: 500;
      opacity: 0.5;
      transition: all 0.3s ease;
    }

    &:hover {
      background-color: rgba(color-get(accent, 500), 0.02);
      border-color: rgba(color-get(accent, 500), 0.8);
      svg {
        opacity: 0.9;
        transform: scale(1.05);
        stroke: rgba(color-get(accent, 200), 0.9);
      }
      span {
        opacity: 0.9;
        color: rgba(color-get(accent, 200), 0.9);
      }
    }
  }
}

.modal-content {
  .modal-header {
    input[type="text"] {
      border: none;
      @include title-style;
      width: 88%;
    }
  }

  .modal-body {
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
      .todo-list__delete-button {
        opacity: 0;
      }
    }
    .todo-list-leave-to {
      opacity: 0;
      transform: translateY(-20px) scaleY(0.1);
      .todo-list__delete-button {
        opacity: 0;
      }
    }

    .todo-list-leave-active {
      position: absolute;
      width: 100%;
    }

    span {
      opacity: 0.5;
      margin-left: 2px;
    }

    ul {
      position: relative;
      list-style-type: none;
      padding: 0px 10px 0px 0px;
      margin: 10px 0px 20px 0px;

      overflow-y: auto;
      overflow-x: hidden;

      height: 300px;

      li {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        padding: 5px 20px;
        height: 40px;

        &:not(:last-child):after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background-color: black;
          opacity: 0.1;
        }

        input {
          width: 100%;
          height: 100%;
          border: none;

          font-size: 1.1rem;
        }

        .todo-list__delete-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .todo-list__add-button {
          margin-top: 10px;
          width: 100%;
          height: 100%;
          border: 2px dashed rgba(color-get(primary, 300), 0.3);
          border-radius: 8px;

          background-color: transparent;
          cursor: pointer;

          transition: all 0.2s ease;

          color: rgba(black, 0.6);
          font-size: 0.825rem;

          &:hover {
            background-color: rgba(color-get(primary, 400), 0.15);
            border-color: rgba(color-get(accent, 500), 0.3);
          }
        }
      }
    }
  }
  .modal-footer {
    button {
      margin-left: 10px;
      padding: 6px 12px;
      background-color: color-get(accent, 400);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;

      font-size: 0.725rem;
      font-weight: 500;

      &:first-child {
        background-color: color-get(primary);
        border: 1px solid rgba(color-get(accent, 400), 0.5);
        color: rgba(#fb4848, 0.5);
      }

      &:hover {
        background-color: color-get(accent, 300);
        color: white;
      }
    }
  }
}

@media only screen and (max-width: 600px) {
  .card-board {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(225px, 325px));
    justify-content: center;

    padding: 50px 25px;

    margin-block: 25px;
  }
}
</style>