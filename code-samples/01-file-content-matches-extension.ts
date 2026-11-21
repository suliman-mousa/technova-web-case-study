/**
 * Excerpt: upload validation — sniffed MIME must match the declared extension.
 * Full module also enforces size limits, DOCX zip handling, and safe path storage.
 * Rejects mismatches (e.g. PNG bytes named `.pdf`) with code `type` (ADR 0007).
 */

const MIME_BY_EXTENSION: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

export async function assertContentMatchesExtension(
  buffer: Buffer,
  ext: string,
  allowedMimes: string[],
): Promise<"ok" | "type"> {
  const { fileTypeFromBuffer } = await import("file-type");
  const detected = await fileTypeFromBuffer(buffer);
  const mime = detected?.mime;
  const expected = MIME_BY_EXTENSION[ext];

  if (!mime || !expected || mime !== expected || !allowedMimes.includes(mime)) {
    return "type";
  }
  return "ok";
}
