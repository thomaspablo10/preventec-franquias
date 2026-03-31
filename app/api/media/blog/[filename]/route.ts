import path from "path";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    filename: string;
  }>;
};

const STORAGE_DIR = path.join(process.cwd(), "storage", "blog");

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { filename } = await context.params;

    if (!/^blog-[a-zA-Z0-9-]+\.webp$/i.test(filename)) {
      return new NextResponse("Arquivo inválido.", { status: 400 });
    }

    const filePath = path.join(STORAGE_DIR, filename);
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Imagem não encontrada.", { status: 404 });
  }
}