"use client";

import { useState } from "react";

type CreateTodoInput = {
  title: string;
  description: string | null;
  deadline: string | null;
};

type TodoFormProps = {
  onCreate: (data: CreateTodoInput) => Promise<void> | void;
  submitting?: boolean;
};

export default function TodoForm({
  onCreate,
  submitting = false,
}: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    await onCreate({
      title: title.trim(),
      description: description.trim() || null,
      deadline: deadline || null,
    });

    setTitle("");
    setDescription("");
    setDeadline("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        Create Todo
      </h2>

      <input
        className="w-full border rounded-lg px-3 py-2 text-gray-900"
        placeholder="Todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full border rounded-lg px-3 py-2 text-gray-900"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        className="border rounded-lg px-3 py-2 text-gray-900"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create Todo"}
      </button>
    </form>
  );
}
