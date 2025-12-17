"use client";

import { useState } from "react";
import { Todo } from "@/hooks/useTodos";

export type TodoItemProps = {
  todo: Todo;
  onToggleStatus: () => void | Promise<void>;
  onEdit: (
    id: string,
    payload: Partial<Pick<Todo, "title" | "description" | "status" | "deadline">>
  ) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
};

export default function TodoItem({
  todo,
  onToggleStatus,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [deadline, setDeadline] = useState(
    todo.deadline ? todo.deadline.slice(0, 10) : ""
  );

  async function handleSave() {
    await onEdit(todo.id, {
      title,
      description,
      deadline: deadline || null,
    });
    setIsEditing(false);
  }

  return (
    <li
      className={`p-4 rounded-lg border bg-white ${
        todo.status === "DONE" ? "opacity-70" : ""
      }`}
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            className="w-full border rounded px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border rounded px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <div className="flex gap-2 text-sm">
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded bg-black text-white"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 rounded border"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`cursor-pointer ${
              todo.status === "DONE" ? "line-through text-gray-500" : ""
            }`}
            onClick={onToggleStatus}
          >
            <strong>{todo.title}</strong> – {todo.status}

            {todo.deadline && (
              <div className="text-sm mt-1">
                Deadline: {todo.deadline.slice(0, 10)}
              </div>
            )}

            {todo.description && (
              <div className="text-sm mt-1">{todo.description}</div>
            )}
          </div>

          <div className="mt-2 flex gap-2 text-sm">
            <button onClick={() => setIsEditing(true)}>✏️</button>
            <button onClick={onDelete}>❌</button>
          </div>
        </>
      )}
    </li>
  );
}
