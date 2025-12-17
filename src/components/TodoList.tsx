"use client";

import { Todo } from "@/hooks/useTodos";
import TodoItem from "./TodoItem";

export type TodoListProps = {
  todos: Todo[];
  onToggleStatus: (todo: Todo) => void | Promise<void>;
  onEdit: (
    id: string,
    payload: Partial<Pick<Todo, "title" | "description" | "status" | "deadline">>
  ) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
};

export default function TodoList({
  todos,
  onToggleStatus,
  onEdit,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return <p className="text-sm text-gray-500">No todos found.</p>;
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleStatus={() => onToggleStatus(todo)}
          onEdit={onEdit}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
    </ul>
  );
}
