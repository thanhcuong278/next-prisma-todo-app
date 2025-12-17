"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useTodos } from "@/hooks/useTodos";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import TodoFilter from "@/components/TodoFilter";

export default function HomePage() {
  const { data: session, status } = useSession();

  const {
    todos,
    loading,
    error,
    refetch,
    createTodo,
    updateTodo,
    deleteTodo,
    filter,
    setFilter,
  } = useTodos(!!session);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading session…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center space-y-4">
          <p className="text-gray-900">You are not signed in</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Sign in
            </button>
            <Link
              href="/signup"
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded text-center"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10 text-gray-900">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm">
            Signed in as <strong>{session.user?.email}</strong>
          </p>
          <button
            onClick={() => signOut()}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Sign out
          </button>
        </section>

        {/* Create */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Create Todo</h2>
          <TodoForm onCreate={createTodo} />
        </section>

        {/* Filter */}
        <section className="bg-white rounded-xl p-4 shadow-sm">
          <TodoFilter filter={filter} onChange={setFilter} />
        </section>

        {/* Todos */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Your Todos</h2>

          {loading && (
            <div className="py-10 text-center text-gray-500">
              Loading your todos…
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg border border-red-300 bg-red-50 text-red-800">
              <p className="mb-2 font-medium">Failed to load todos</p>
              <p className="text-sm mb-3">{error}</p>
              <button
                onClick={refetch}
                className="px-3 py-1 text-sm rounded bg-red-600 text-white"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && todos.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <p className="text-lg mb-2">No todos yet</p>
              <p className="text-sm">
                Create your first todo to get started.
              </p>
            </div>
          )}

          {!loading && !error && todos.length > 0 && (
            <TodoList
              todos={todos}
              onToggleStatus={(todo) =>
                updateTodo(todo.id, {
                  status: todo.status === "DONE" ? "TODO" : "DONE",
                })
              }
              onEdit={updateTodo}
              onDelete={deleteTodo}
            />
          )}
        </section>
      </div>
    </main>
  );
}
