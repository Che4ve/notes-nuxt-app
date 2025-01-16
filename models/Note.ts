import type { Todo } from "~/models/Todo";

export interface Note {
  id: string;
  title: string;
  todoList: Todo[];
}
