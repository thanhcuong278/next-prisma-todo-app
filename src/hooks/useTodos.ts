"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type TodoStatus = "TODO" | "DOING" | "DONE";

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  deadline: string | null;
  createdAt?: string;
};

export type TodoFilter = {
  search: string;
  status: "ALL" | TodoStatus;
  sort:
    | "createdAt_desc"
    | "createdAt_asc"
    | "deadline_asc"
    | "deadline_desc";
};

const defaultFilter: TodoFilter = {
  search: "",
  status: "ALL",
  sort: "createdAt_desc",
};

export function useTodos(isEnabled: boolean) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>(defaultFilter);

  // -----------------------------
  // Fetch
  // -----------------------------
  const fetchTodos = useCallback(async () => {
    if (!isEnabled) {
      setTodos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to fetch todos");
      setTodos(await res.json());
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [isEnabled]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // -----------------------------
  // Create
  // -----------------------------
  const createTodo = useCallback(async (payload: {
    title: string;
    description?: string;
    deadline?: string | null;
  }) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Create todo failed");

    const created: Todo = await res.json();
    setTodos((prev) => [created, ...prev]);
  }, []);

  // -----------------------------
  // Update
  // -----------------------------
  const updateTodo = useCallback(
    async (
      id: string,
      payload: Partial<
        Pick<Todo, "title" | "description" | "status" | "deadline">
      >
    ) => {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update todo failed");

      const updated: Todo = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    },
    []
  );

  // -----------------------------
  // Delete
  // -----------------------------
  const deleteTodo = useCallback(
    async (id: string) => {
      const prev = todos;
      setTodos((t) => t.filter((x) => x.id !== id));

      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setTodos(prev);
        throw new Error("Delete todo failed");
      }
    },
    [todos]
  );

  // -----------------------------
  // Filter + Sort (derived)
  // -----------------------------
  const visibleTodos = useMemo(() => {
    let data = [...todos];

    if (filter.search) {
      const q = filter.search.toLowerCase();
      data = data.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description?.toLowerCase().includes(q) ?? false)
      );
    }

    if (filter.status !== "ALL") {
      data = data.filter((t) => t.status === filter.status);
    }

    switch (filter.sort) {
      case "createdAt_asc":
        data.sort(
          (a: any, b: any) =>
            +new Date(a.createdAt) - +new Date(b.createdAt)
        );
        break;
      case "deadline_asc":
        data.sort(
          (a, b) => +new Date(a.deadline || 0) - +new Date(b.deadline || 0)
        );
        break;
      case "deadline_desc":
        data.sort(
          (a, b) => +new Date(b.deadline || 0) - +new Date(a.deadline || 0)
        );
        break;
      default:
        data.sort(
          (a: any, b: any) =>
            +new Date(b.createdAt) - +new Date(a.createdAt)
        );
    }

    return data;
  }, [todos, filter]);

  return {
    todos: visibleTodos,
    rawTodos: todos,
    loading,
    error,
    filter,
    setFilter,
    refetch: fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  } as const;
}
