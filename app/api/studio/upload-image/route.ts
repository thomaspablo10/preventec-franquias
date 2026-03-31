import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { processAndSaveImage } from "@/lib/image-upload";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    if (!["MASTER", "ADMIN", "EDITOR", "REVIEWER"].includes(session.role)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const saved = await processAndSaveImage(file);

    return NextResponse.json({
      success: true,
      url: saved.url,
    });
  } catch (error) {
    console.error("Erro no upload da imagem:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao enviar imagem.",
      },
      { status: 400 }
    );
  }
}