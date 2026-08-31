export function formatRupiah(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "Rp0";
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

export function parseNumber(value) {
  if (typeof value === "number") return value;
  const cleaned = String(value ?? "").replace(/[^\d.-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
