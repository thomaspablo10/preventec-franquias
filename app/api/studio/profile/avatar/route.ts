import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getStorageDir() {
  return path.join(process.cwd(), "storage", "avatars");
}

function getFileNameFromAvatarUrl(url: string | null | undefined) {
  if (!url) return null;

  const match = url.match(/\/api\/studio\/profile\/avatar\/([^/?]+)/);
  return match?.[1] || null;
}

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo inválido." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato inválido. Use JPG, PNG ou WEBP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Arquivo maior que 8MB." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    const storageDir = getStorageDir();
    await fs.mkdir(storageDir, { recursive: true });

    const fileName = `avatar-${session.userId}-${Date.now()}.webp`;
    const filePath = path.join(storageDir, fileName);

    await sharp(bytes)
      .resize(512, 512, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 84 })
      .toFile(filePath);

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { avatarUrl: true },
    });

    const oldFileName = getFileNameFromAvatarUrl(user?.avatarUrl);
    if (oldFileName && oldFileName !== fileName) {
      const oldPath = path.join(storageDir, oldFileName);
      await fs.unlink(oldPath).catch(() => {});
    }

    const avatarUrl = `/api/studio/profile/avatar/${fileName}`;

    await prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl },
    });

    return NextResponse.json({
      success: true,
      avatarUrl,
    });
  } catch (error) {
    console.error("Erro ao enviar avatar:", error);
    return NextResponse.json({ error: "Erro ao enviar avatar." }, { status: 500 });
  }
}