"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { BodyImage } from "@/components/studio/extensions/body-image";
import { EmbedBlock } from "@/components/studio/extensions/embed-block";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseEmbedUrl } from "@/lib/editor-embeds";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}

type TiptapEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

type EditorModalType = "link" | "embed" | "image" | "highlight" | null;
type ImageDisplay = "left" | "center" | "right" | "full";
type ImageWidthPreset = "narrow" | "medium" | "wide" | "full";

const HIGHLIGHT_COLORS = [
  { label: "Amarelo", value: "#fef08a" },
  { label: "Verde", value: "#bbf7d0" },
  { label: "Azul", value: "#bfdbfe" },
  { label: "Rosa", value: "#fbcfe8" },
  { label: "Laranja", value: "#fed7aa" },
  { label: "Roxo", value: "#ddd6fe" },
];

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

let instagramScriptPromise: Promise<void> | null = null;

function loadInstagramScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.instgrm?.Embeds?.process) {
    return Promise.resolve();
  }

  if (instagramScriptPromise) {
    return instagramScriptPromise;
  }

  instagramScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Erro ao carregar Instagram embed.js")),
        { once: true }
      );

      setTimeout(() => {
        if (window.instgrm?.Embeds?.process) {
          resolve();
        }
      }, 300);

      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Erro ao carregar Instagram embed.js"));

    document.body.appendChild(script);
  });

  return instagramScriptPromise;
}

function ToolbarButton({
  label,
  title,
  onClick,
  isActive = false,
  disabled = false,
}: {
  label: string;
  title?: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title || label}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}

function isMarkStored(editor: any, markName: string) {
  const { state } = editor;
  const storedMarks = state.storedMarks || state.selection.$from.marks();

  return storedMarks.some((mark: any) => mark.type.name === markName);
}

function isNodeStored(editor: any, nodeName: string, attrs?: Record<string, any>) {
  return editor.isActive(nodeName, attrs);
}

function isTextAlignStored(editor: any, align: "left" | "center" | "right" | "justify") {
  return editor.isActive({ textAlign: align });
}

export function TiptapEditor({
  value,
  onChange,
  disabled = false,
}: TiptapEditorProps) {
  const [modalType, setModalType] = useState<EditorModalType>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageDisplay, setImageDisplay] = useState<ImageDisplay>("center");
  const [imageWidthPreset, setImageWidthPreset] = useState<ImageWidthPreset>("wide");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [modalError, setModalError] = useState("");
  const [highlightColor, setHighlightColor] = useState("#fef08a");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: false,
        underline: false,
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      BodyImage.configure({
        inline: false,
      }),
      Youtube.configure({
        width: 840,
        height: 472,
        modestBranding: true,
      }),
      EmbedBlock,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content: value || "<p></p>",
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();

    if (value !== currentHtml) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    const hasInstagram = value.includes("instagram-media");

    if (!hasInstagram) return;

    loadInstagramScript()
      .then(() => {
        window.instgrm?.Embeds?.process?.();
      })
      .catch(() => {});
  }, [value]);

  function closeModal() {
    setModalType(null);
    setModalError("");
  }

  function openLinkModal() {
    if (!editor || disabled) return;

    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setModalError("");
    setModalType("link");
  }

  function openEmbedModal() {
    if (!editor || disabled) return;

    setEmbedUrl("");
    setModalError("");
    setModalType("embed");
  }

  function openImageModal() {
    if (!editor || disabled) return;

    const currentImageAttrs = editor.isActive("bodyImage")
      ? editor.getAttributes("bodyImage")
      : null;

    setImageUrl(currentImageAttrs?.src || "");
    setImageAlt(currentImageAttrs?.alt || "");
    setImageDisplay((currentImageAttrs?.display as ImageDisplay) || "center");
    setImageWidthPreset(
      (currentImageAttrs?.widthPreset as ImageWidthPreset) || "wide"
    );
    setModalError("");
    setModalType("image");
  }

  function openHighlightModal() {
    if (!editor || disabled) return;

    if (editor.isActive("highlight")) {
      editor.chain().focus().unsetHighlight().run();
      return;
    }

    const currentColor = editor.getAttributes("highlight").color || "#fef08a";
    setHighlightColor(currentColor);
    setModalError("");
    setModalType("highlight");
  }

  function saveLink() {
    if (!editor) return;

    const trimmedUrl = linkUrl.trim();

    if (!trimmedUrl) {
      editor.chain().focus().unsetLink().run();
      closeModal();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmedUrl }).run();
    closeModal();
  }

  function saveEmbed() {
    if (!editor) return;

    try {
      const parsed = parseEmbedUrl(embedUrl);

      const html = `
        <div
          data-embed-block="true"
          data-provider="${escapeHtmlAttribute(parsed.provider)}"
          data-url="${escapeHtmlAttribute(parsed.originalUrl)}"
          data-embed-url="${escapeHtmlAttribute(parsed.embedUrl)}"
          data-mode="${escapeHtmlAttribute(parsed.mode)}"
        ></div>
      `;

      editor.chain().focus().insertContent(html).run();
      closeModal();

      if (parsed.provider === "instagram") {
        setTimeout(() => {
          loadInstagramScript()
            .then(() => {
              window.instgrm?.Embeds?.process?.();
            })
            .catch(() => {});
        }, 50);
      }
    } catch (error) {
      setModalError(
        error instanceof Error ? error.message : "Não foi possível inserir o vídeo."
      );
    }
  }

  function saveHighlight() {
    if (!editor) return;

    editor.chain().focus().toggleHighlight({ color: highlightColor }).run();
    closeModal();
  }

  function removeHighlight() {
    if (!editor) return;

    editor.chain().focus().unsetHighlight().run();
    closeModal();
  }

  function saveImage() {
    if (!editor) return;

    if (!imageUrl.trim()) {
      setModalError("Faça o upload da imagem antes de inserir.");
      return;
    }

    const attrs = {
      src: imageUrl.trim(),
      alt: imageAlt.trim() || "Imagem do conteúdo",
      title: imageAlt.trim() || "Imagem do conteúdo",
      display: imageDisplay,
      widthPreset: imageWidthPreset,
    };

    if (editor.isActive("bodyImage")) {
      editor.chain().focus().updateAttributes("bodyImage", attrs).run();
    } else {
      const html = `
        <img
          src="${escapeHtmlAttribute(attrs.src)}"
          alt="${escapeHtmlAttribute(attrs.alt)}"
          title="${escapeHtmlAttribute(attrs.title)}"
          data-display="${escapeHtmlAttribute(attrs.display)}"
          data-width="${escapeHtmlAttribute(attrs.widthPreset)}"
        />
      `;

      editor.chain().focus().insertContent(html).run();
    }

    closeModal();
  }

  async function handleBodyImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingImage(true);
    setModalError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/studio/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setModalError(data.error || "Erro ao enviar imagem.");
        return;
      }

      setImageUrl(data.url);
    } catch {
      setModalError("Erro ao conectar com o servidor no upload da imagem.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  const embedHelperText = useMemo(() => {
    return "Cole a URL do YouTube, Instagram Reel/post, Facebook vídeo/Reel ou TikTok.";
  }, []);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
        Carregando editor...
      </div>
    );
  }

  const boldActive = editor.isActive("bold") || isMarkStored(editor, "bold");
  const italicActive = editor.isActive("italic") || isMarkStored(editor, "italic");
  const underlineActive =
    editor.isActive("underline") || isMarkStored(editor, "underline");
  const highlightActive =
    editor.isActive("highlight") || isMarkStored(editor, "highlight");

  const h2Active = isNodeStored(editor, "heading", { level: 2 });
  const h3Active = isNodeStored(editor, "heading", { level: 3 });

  const leftActive = isTextAlignStored(editor, "left");
  const centerActive = isTextAlignStored(editor, "center");
  const rightActive = isTextAlignStored(editor, "right");
  const justifyActive = isTextAlignStored(editor, "justify");

  return (
    <>
      <div className="rounded-2xl border border-zinc-300 bg-white">
        <div className="sticky top-0 z-20 rounded-t-2xl border-b border-zinc-200 bg-white/95 p-3 backdrop-blur">
          <div className="flex flex-wrap gap-2">
            <ToolbarButton
              label="Negrito"
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={boldActive}
              disabled={disabled}
            />

            <ToolbarButton
              label="Itálico"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={italicActive}
              disabled={disabled}
            />

            <ToolbarButton
              label="Sublinhado"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={underlineActive}
              disabled={disabled}
            />

            <ToolbarButton
              label={highlightActive ? "Remover destaque" : "Destacado"}
              onClick={openHighlightModal}
              isActive={highlightActive}
              disabled={disabled}
            />

            <ToolbarButton
              label="Título"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={h2Active}
              disabled={disabled}
            />

            <ToolbarButton
              label="Subtítulo"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={h3Active}
              disabled={disabled}
            />

            <ToolbarButton
              label="Lista"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              disabled={disabled}
            />

            <ToolbarButton
              label="Lista numerada"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              disabled={disabled}
            />

            <ToolbarButton
              label="Citação"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              disabled={disabled}
            />

            <ToolbarButton
              label="Linha"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              disabled={disabled}
            />

            <ToolbarButton
              label="Link"
              onClick={openLinkModal}
              isActive={editor.isActive("link")}
              disabled={disabled}
            />

            <ToolbarButton
              label="Imagem"
              onClick={openImageModal}
              disabled={disabled}
            />

            <ToolbarButton
              label="Vídeo"
              onClick={openEmbedModal}
              disabled={disabled}
            />

            <ToolbarButton
              label="Esquerda"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={leftActive}
              disabled={disabled}
            />

            <ToolbarButton
              label="Centro"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              isActive={centerActive}
              disabled={disabled}
            />

            <ToolbarButton
              label="Direita"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={rightActive}
              disabled={disabled}
            />

            <ToolbarButton
              label="Justificado"
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              isActive={justifyActive}
              disabled={disabled}
            />

            <ToolbarButton
              label="Desfazer"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={disabled || !editor.can().chain().focus().undo().run()}
            />

            <ToolbarButton
              label="Refazer"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={disabled || !editor.can().chain().focus().redo().run()}
            />
          </div>
        </div>

        <div className="p-4">
          <EditorContent editor={editor} className="studio-tiptap" />
        </div>
      </div>

      <Dialog open={modalType === "link"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inserir link</DialogTitle>
            <DialogDescription>
              Informe a URL do link. Se deixar vazio, o link atual será removido.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://exemplo.com"
              disabled={disabled}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={saveLink}>
              Salvar link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalType === "embed"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inserir vídeo</DialogTitle>
            <DialogDescription>{embedHelperText}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              value={embedUrl}
              onChange={(event) => setEmbedUrl(event.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              disabled={disabled}
            />
            {modalError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {modalError}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={saveEmbed}>
              Inserir vídeo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalType === "highlight"}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Destacar texto</DialogTitle>
            <DialogDescription>
              Escolha a cor do destaque para o texto selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setHighlightColor(color.value)}
                className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  highlightColor === color.value
                    ? "border-zinc-900 bg-zinc-100"
                    : "border-zinc-300 bg-white hover:bg-zinc-50"
                }`}
              >
                <span
                  className="h-5 w-5 rounded-full border border-zinc-300"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-sm font-medium text-zinc-700">{color.label}</span>
              </button>
            ))}
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={removeHighlight}>
              Remover destaque
            </Button>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={saveHighlight}>
              Aplicar destaque
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalType === "image"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inserir imagem no conteúdo</DialogTitle>
            <DialogDescription>
              Faça upload da imagem, defina o alinhamento e o tamanho para manter o layout do post organizado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Upload da imagem</label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleBodyImageUpload}
                disabled={disabled || uploadingImage}
              />
              <p className="text-xs text-zinc-500">
                Permitidos: JPG, PNG e WEBP. Máximo de 5 MB antes da compressão.
              </p>
            </div>

            {uploadingImage ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                Processando e compactando imagem...
              </div>
            ) : null}

            {imageUrl ? (
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <img
                  src={imageUrl}
                  alt={imageAlt || "Prévia da imagem"}
                  className="max-h-72 w-full rounded-xl object-contain bg-white"
                />
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Texto alternativo</label>
                <Textarea
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                  placeholder="Descrição curta da imagem"
                  disabled={disabled}
                  className="min-h-20"
                />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Alinhamento</label>
                  <select
                    value={imageDisplay}
                    onChange={(event) => setImageDisplay(event.target.value as ImageDisplay)}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    disabled={disabled}
                  >
                    <option value="left">Esquerda</option>
                    <option value="center">Centro</option>
                    <option value="right">Direita</option>
                    <option value="full">Largura total</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Tamanho</label>
                  <select
                    value={imageWidthPreset}
                    onChange={(event) =>
                      setImageWidthPreset(event.target.value as ImageWidthPreset)
                    }
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                    disabled={disabled}
                  >
                    <option value="narrow">Estreita</option>
                    <option value="medium">Média</option>
                    <option value="wide">Larga</option>
                    <option value="full">Total</option>
                  </select>
                </div>
              </div>
            </div>

            {modalError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {modalError}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={saveImage} disabled={uploadingImage}>
              Inserir imagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}