"use client";

import { useEffect, useState } from "react";
import { listMyDocuments, type AppDocument } from "@/lib/documents";

function formatScope(scope: AppDocument["scope"]) {
  return scope === "global" ? "Global" : "Da sua franquia";
}

export default function PortalDocumentsPage() {
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        setErrorMessage("");
        const data = await listMyDocuments();
        setDocuments(data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os documentos.";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6 pb-24 md:p-8 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Documentos</h1>
        <p className="mt-2 text-muted-foreground">
          Aqui estão os documentos disponíveis para sua unidade.
        </p>
      </div>

      {errorMessage ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="rounded-xl border border-border bg-white p-6 text-muted-foreground">
            Carregando documentos...
          </div>
        ) : documents.length > 0 ? (
          documents.map((document) => (
            <div
              key={document.id}
              className="rounded-xl border border-border bg-white p-5"
            >
              <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-bold text-foreground">
                  {document.title}
                </h2>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {formatScope(document.scope)}
                </span>
              </div>

              <p className="mb-3 text-sm text-muted-foreground">
                {document.description || "Sem descrição."}
              </p>

              <div className="mb-4 text-sm">
                <p>
                  <strong>Categoria:</strong> {document.category || "-"}
                </p>
              </div>

              <a
                href={document.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Abrir Documento
              </a>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-border bg-white p-6 text-muted-foreground">
            Nenhum documento disponível no momento.
          </div>
        )}
      </div>
    </div>
  );
}