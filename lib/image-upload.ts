import path from "path";
import { promises as fs } from "fs";
import sharp from "sharp";
import crypto from "crypto";

const STORAGE_DIR = path.join(process.cwd(), "storage", "blog");

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const OUTPUT_QUALITY = 82;

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ALLOWED_MAGIC_NUMBERS = {
  jpeg: ["ffd8ff"],
  png: ["89504e470d0a1a0a"],
  webp: ["52494646"],
};

function toHex(buffer: Buffer, length = 16) {
  return buffer.subarray(0, length).toString("hex").toLowerCase();
}

function isSafeMimeType(mimeType: string) {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

function hasValidMagicNumber(buffer: Buffer, mimeType: string) {
  const hex = toHex(buffer, 16);

  if (mimeType === "image/jpeg") {
    return ALLOWED_MAGIC_NUMBERS.jpeg.some((sig) => hex.startsWith(sig));
  }

  if (mimeType === "image/png") {
    return ALLOWED_MAGIC_NUMBERS.png.some((sig) => hex.startsWith(sig));
  }

  if (mimeType === "image/webp") {
    return (
      hex.startsWith(ALLOWED_MAGIC_NUMBERS.webp[0]) &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

async function ensureStorageDir() {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
}

function generateUniqueFilename() {
  const random = crypto.randomUUID().replace(/-/g, "");
  return `blog-${Date.now()}-${random}.webp`;
}

export async function processAndSaveImage(file: File) {
  if (!isSafeMimeType(file.type)) {
    throw new Error("Tipo de arquivo não permitido. Envie JPG, PNG ou WEBP.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("A imagem excede o limite de 5 MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!hasValidMagicNumber(buffer, file.type)) {
    throw new Error("Arquivo inválido ou com assinatura incompatível.");
  }

  const image = sharp(buffer, { failOn: "error" });
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Não foi possível identificar as dimensões da imagem.");
  }

  await ensureStorageDir();

  const filename = generateUniqueFilename();
  const outputPath = path.join(STORAGE_DIR, filename);

  await image
    .rotate()
    .resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: OUTPUT_QUALITY,
    })
    .toFile(outputPath);

  await fs.access(outputPath);

  return {
    filename,
    url: `/api/media/blog/${filename}`,
  };
}