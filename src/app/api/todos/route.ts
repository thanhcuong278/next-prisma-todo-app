export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

/**
 * GET /api/todos
 * Get all todos of current user
 */
export async function GET() {
  const session = await getAuthSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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

  const todos = await prisma.todo.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(todos, { status: 200 });
}

/**
 * POST /api/todos
 * Create a new todo for current user
 */
export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { title, description, deadline } = body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json(
      { message: "Title is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  const todo = await prisma.todo.create({
    data: {
      title: title.trim(),
      description,
      deadline: deadline ? new Date(deadline) : null,
      userId: user.id,
    },
  });

  return NextResponse.json(todo, { status: 201 });
}
