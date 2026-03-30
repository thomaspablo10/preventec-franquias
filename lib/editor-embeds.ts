export type EmbedProvider = "youtube" | "instagram" | "facebook" | "tiktok";
export type EmbedMode = "horizontal" | "vertical";

export type ParsedEmbed = {
  provider: EmbedProvider;
  mode: EmbedMode;
  originalUrl: string;
  embedUrl: string;
};

function normalizeUrl(value: string) {
  return value.trim();
}

function ensureAbsoluteUrl(value: string) {
  const trimmed = normalizeUrl(value);

  if (!trimmed) {
    throw new Error("Informe uma URL válida.");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return new URL(trimmed);
  }

  return new URL(`https://${trimmed}`);
}

function getYoutubeId(url: URL) {
  const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();

  if (hostname === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id || null;
  }

  if (hostname === "youtube.com" || hostname === "m.youtube.com") {
    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }

    if (url.pathname.startsWith("/shorts/")) {
      const id = url.pathname.split("/").filter(Boolean)[1];
      return id || null;
    }

    if (url.pathname.startsWith("/embed/")) {
      const id = url.pathname.split("/").filter(Boolean)[1];
      return id || null;
    }
  }

  return null;
}

function isYoutubeShort(url: URL) {
  const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();

  if (hostname === "youtube.com" || hostname === "m.youtube.com") {
    return url.pathname.startsWith("/shorts/");
  }

  return false;
}

function getInstagramCanonicalUrl(url: URL) {
  const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();

  if (!hostname.endsWith("instagram.com")) {
    return null;
  }

  const pathname = url.pathname.replace(/\/+$/g, "");
  const match = pathname.match(/^\/(reel|reels|p|tv)\/([^/]+)$/i);

  if (!match?.[2]) {
    return null;
  }

  const type = match[1].toLowerCase();
  const code = match[2];

  if (type === "reel" || type === "reels") {
    return `https://www.instagram.com/reel/${code}/`;
  }

  if (type === "p") {
    return `https://www.instagram.com/p/${code}/`;
  }

  if (type === "tv") {
    return `https://www.instagram.com/tv/${code}/`;
  }

  return null;
}

function getFacebookTarget(url: URL) {
  const pathname = url.pathname.replace(/\/+$/g, "");

  if (/\/videos\//i.test(pathname) || /\/reel\//i.test(pathname)) {
    return url.toString();
  }

  return null;
}

function getTikTokId(url: URL) {
  const pathname = url.pathname.replace(/\/+$/g, "");
  const directMatch = pathname.match(/\/video\/(\d+)/i);

  if (directMatch?.[1]) {
    return directMatch[1];
  }

  const shareMatch = url.searchParams.get("shareItemId");

  if (shareMatch) {
    return shareMatch;
  }

  return null;
}

export function parseEmbedUrl(rawUrl: string): ParsedEmbed {
  const url = ensureAbsoluteUrl(rawUrl);
  const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();

  if (["youtube.com", "m.youtube.com", "youtu.be"].includes(hostname)) {
    const id = getYoutubeId(url);

    if (!id) {
      throw new Error("Não foi possível identificar o vídeo do YouTube.");
    }

    const isShort = isYoutubeShort(url);

    return {
      provider: "youtube",
      mode: isShort ? "vertical" : "horizontal",
      originalUrl: url.toString(),
      embedUrl: `https://www.youtube.com/embed/${id}`,
    };
  }

  if (hostname.endsWith("instagram.com")) {
    const canonicalUrl = getInstagramCanonicalUrl(url);

    if (!canonicalUrl) {
      throw new Error("Use uma URL válida de post ou Reel do Instagram.");
    }

    return {
      provider: "instagram",
      mode: "vertical",
      originalUrl: canonicalUrl,
      embedUrl: canonicalUrl,
    };
  }

  if (hostname.endsWith("facebook.com") || hostname === "fb.watch") {
    const href = getFacebookTarget(url);

    if (!href) {
      throw new Error("Use uma URL de vídeo ou Reel do Facebook.");
    }

    return {
      provider: "facebook",
      mode: "vertical",
      originalUrl: url.toString(),
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        href
      )}&show_text=false&t=0`,
    };
  }

  if (
    hostname.endsWith("tiktok.com") ||
    hostname === "vm.tiktok.com" ||
    hostname === "vt.tiktok.com"
  ) {
    const id = getTikTokId(url);

    if (!id) {
      throw new Error("Não foi possível identificar o vídeo do TikTok.");
    }

    return {
      provider: "tiktok",
      mode: "vertical",
      originalUrl: url.toString(),
      embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
    };
  }

  throw new Error(
    "Plataforma não suportada. Use YouTube, Instagram, Facebook vídeo/Reel ou TikTok."
  );
}