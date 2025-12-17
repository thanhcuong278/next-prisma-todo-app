"use client";

import { TodoFilter as FilterType, TodoStatus } from "@/hooks/useTodos";

export type TodoFilterProps = {
  filter: FilterType;
  onChange: (next: FilterType) => void;
};

export default function TodoFilter({ filter, onChange }: TodoFilterProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* Search */}
      <input
        className="border rounded px-3 py-2"
        placeholder="Search todos..."
        value={filter.search}
        onChange={(e) =>
          onChange({ ...filter, search: e.target.value })
        }
      />

      <div className="flex gap-4 flex-wrap">

        {/* Status */}
        <select
          className="border rounded px-3 py-2"
          value={filter.status}
          onChange={(e) =>
            onChange({
              ...filter,
              status: e.target.value as "ALL" | TodoStatus,
            })
          }
        >
          <option value="ALL">All</option>
          <option value="TODO">Todo</option>
          <option value="DOING">Doing</option>
          <option value="DONE">Done</option>
        </select>

        {/* Sort */}
        <select
          className="border rounded px-3 py-2"
          value={filter.sort}
          onChange={(e) =>
            onChange({
              ...filter,
              sort: e.target.value as FilterType["sort"],
            })
          }
        >
          <option value="createdAt_desc">Newest</option>
          <option value="createdAt_asc">Oldest</option>
          <option value="deadline_asc">Deadline ↑</option>
          <option value="deadline_desc">Deadline ↓</option>
        </select>

      </div>
    </div>
  );
}
