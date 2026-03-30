import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getStorageDir() {
  return path.join(process.cwd(), "storage", "avatars");
}

type RouteContext = {
  params: Promise<{
    fileName: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { fileName } = await context.params;

    if (!fileName || fileName.includes("..") || fileName.includes("/")) {
      return new NextResponse("Arquivo inválido.", { status: 400 });
    }

    const filePath = path.join(getStorageDir(), fileName);
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch {
    return new NextResponse("Arquivo não encontrado.", { status: 404 });
  }
}