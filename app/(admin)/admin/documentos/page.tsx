"use client";

import { FormEvent, useEffect, useState } from "react";
import { listFranchises, type Franchise } from "@/lib/franchises";
import {
  createDocument,
  listAdminDocuments,
  uploadDocumentFile,
  type AppDocument,
  type DocumentScope,
} from "@/lib/documents";

type FormData = {
  title: string;
  description: string;
  category: string;
  scope: DocumentScope;
  franchise_id: string;
};

const initialFormData: FormData = {
  title: "",
  description: "",
  category: "",
  scope: "global",
  franchise_id: "",
};

function formatScope(scope: DocumentScope) {
  return scope === "global" ? "Global" : "Franquia";
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  async function loadData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [documentsData, franchisesData] = await Promise.all([
        listAdminDocuments(),
        listFranchises(),
      ]);

      setDocuments(documentsData);
      setFranchises(franchisesData.filter((item) => item.status !== "inactive"));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível carregar os dados.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function closeModal() {
    if (submitting) return;
    setIsModalOpen(false);
    setSelectedFile(null);
    setFormData(initialFormData);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      if (!selectedFile) {
        throw new Error("Selecione um arquivo.");
      }

      const uploadResponse = await uploadDocumentFile(selectedFile, formData.title);

      const created = await createDocument({
        title: formData.title,
        description: formData.description || null,
        category: formData.category || null,
        file_url: uploadResponse.file_url,
        scope: formData.scope,
        franchise_id:
          formData.scope === "franchise" && formData.franchise_id
            ? Number(formData.franchise_id)
            : null,
        is_active: true,
      });

      setDocuments((prev) => [created, ...prev]);
      closeModal();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível cadastrar o documento.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6 pb-24 md:p-8 md:pb-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold text-foreground">
          Gerenciar Documentos
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
        >
          + Adicionar Documento
        </button>
      </div>

      {errorMessage ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-left font-semibold">Título</th>
                <th className="px-6 py-4 text-left font-semibold">Categoria</th>
                <th className="px-6 py-4 text-left font-semibold">Escopo</th>
                <th className="px-6 py-4 text-left font-semibold">Arquivo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    Carregando documentos...
                  </td>
                </tr>
              ) : documents.length > 0 ? (
                documents.map((document) => (
                  <tr key={document.id} className="border-b border-border">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{document.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {document.description || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{document.category || "-"}</td>
                    <td className="px-6 py-4">{formatScope(document.scope)}</td>
                    <td className="px-6 py-4">
                      <a
                        href={document.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        Abrir
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    Nenhum documento cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Cadastrar Documento</h2>
              <button onClick={closeModal} className="text-sm font-semibold">
                Fechar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Categoria</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Arquivo</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Escopo</label>
                <select
                  value={formData.scope}
                  onChange={(e) =>
                    updateField("scope", e.target.value as DocumentScope)
                  }
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="global">Global</option>
                  <option value="franchise">Franquia</option>
                </select>
              </div>

              {formData.scope === "franchise" ? (
                <div>
                  <label className="mb-1 block text-sm font-medium">Franquia</label>
                  <select
                    value={formData.franchise_id}
                    onChange={(e) => updateField("franchise_id", e.target.value)}
                    className="w-full rounded-lg border px-3 py-2"
                    required
                  >
                    <option value="">Selecione</option>
                    {franchises.map((franchise) => (
                      <option key={franchise.id} value={franchise.id}>
                        {franchise.trade_name} - {franchise.city}/{franchise.state}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border px-4 py-2 font-medium"
                  disabled={submitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-2 font-medium text-white"
                  disabled={submitting}
                >
                  {submitting ? "Salvando..." : "Salvar Documento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}