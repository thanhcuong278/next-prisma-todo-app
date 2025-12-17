export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { TodoStatus } from "@prisma/client";

/**
 * PATCH /api/todos/:id
 * Update a todo of current user (ownership required)
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Unwrap params (Next.js 15+)
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { message: "Todo id is required" },
      { status: 400 }
    );
  }

  // Check session
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Parse body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { title, description, status, deadline } = body;

  // Build update data (partial update)
  const data: Record<string, any> = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { message: "Title must be a non-empty string" },
        { status: 400 }
      );
    }
    data.title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return NextResponse.json(
        { message: "Description must be a string" },
        { status: 400 }
      );
    }
    data.description = description;
  }

  if (status !== undefined) {
    if (!Object.values(TodoStatus).includes(status)) {
      return NextResponse.json(
        { message: "Invalid todo status" },
        { status: 400 }
      );
    }
    data.status = status;
  }

  if (deadline !== undefined) {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { message: "Invalid deadline" },
        { status: 400 }
      );
    }
    data.deadline = date;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { message: "No valid fields to update" },
      { status: 400 }
    );
  }

  // Find current user (DB is source of truth)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  // Ownership check (atomic)
  const todo = await prisma.todo.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!todo) {
    return NextResponse.json(
      { message: "Todo not found" },
      { status: 404 }
    );
  }

  // Update todo
  const updatedTodo = await prisma.todo.update({
    where: { id },
    data,
  });

  return NextResponse.json(updatedTodo, { status: 200 });
}

/**
 * DELETE /api/todos/:id
 * Delete a todo of current user (ownership required)
 */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Unwrap params
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { message: "Todo id is required" },
      { status: 400 }
    );
  }

  // Check session
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  // Ownership check
  const todo = await prisma.todo.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!todo) {
    return NextResponse.json(
      { message: "Todo not found" },
      { status: 404 }
    );
  }

  // Delete
  await prisma.todo.delete({
    where: { id },
  });

  return NextResponse.json(
    { message: "Todo deleted successfully" },
    { status: 200 }
  );
}
