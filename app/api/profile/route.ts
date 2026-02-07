import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, image, birthDate, gender } = body;

    const data: Record<string, string | null> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "이름을 입력해주세요" }, { status: 400 });
      }
      data.name = name.trim();
    }

    if (image !== undefined) {
      data.image = image;
    }

    if (birthDate !== undefined) {
      data.birthDate = birthDate || null;
    }

    if (gender !== undefined) {
      if (gender && !["male", "female"].includes(gender)) {
        return NextResponse.json({ error: "Invalid gender" }, { status: 400 });
      }
      data.gender = gender || null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        image: true,
        birthDate: true,
        gender: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
