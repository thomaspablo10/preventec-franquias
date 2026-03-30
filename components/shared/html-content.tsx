"use client";

import { useEffect, useMemo } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}

type HtmlContentProps = {
  html: string;
  className?: string;
};

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

function decodeHtmlEntities(value: string) {
  if (typeof window === "undefined") {
    return value;
  }

  if (!value) {
    return "";
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

export function HtmlContent({ html, className }: HtmlContentProps) {
  const normalizedHtml = useMemo(() => {
    if (!html) {
      return "";
    }

    const decoded = decodeHtmlEntities(html);

    if (decoded.includes("<h") || decoded.includes("<p") || decoded.includes("<div")) {
      return decoded;
    }

    return html;
  }, [html]);

  useEffect(() => {
    if (!normalizedHtml.includes("instagram-media")) {
      return;
    }

    let cancelled = false;

    async function processInstagramEmbeds() {
      try {
        await loadInstagramScript();

        if (cancelled) return;

        window.instgrm?.Embeds?.process?.();
      } catch {
        // sem erro visual aqui
      }
    }

    processInstagramEmbeds();

    return () => {
      cancelled = true;
    };
  }, [normalizedHtml]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: normalizedHtml }}
    />
  );
}