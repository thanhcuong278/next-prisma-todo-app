export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["TODO", "DOING", "DONE"];

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, status, deadline } = body;
    const data: any = {};

    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description;
    if (status !== undefined && VALID_STATUSES.includes(status)) {
      data.status = status;
    }
    if (deadline !== undefined) {
      const date = new Date(deadline);
      if (!isNaN(date.getTime())) data.deadline = date;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const updatedTodo = await prisma.todo.update({
      where: { id, userId: user.id },
      data,
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    await prisma.todo.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Delete failed" }, { status: 400 });
  }
}