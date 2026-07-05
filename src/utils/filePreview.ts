const WRAP_EXTENSIONS = new Set([
  "ts", "tsx", "js", "jsx", "json", "md", "css", "html", "htm", "xml",
  "svg", "yaml", "yml", "toml", "ini", "cfg", "conf", "env",
  "py", "rb", "go", "rs", "java", "c", "cpp", "h", "hpp",
  "sh", "bash", "zsh", "fish", "ps1", "bat", "cmd",
  "sql", "graphql", "gql",
  "txt", "log", "csv", "tsv",
]);

const WRAP_MIME_PREFIXES = [
  "text/",
  "application/json",
  "application/javascript",
  "application/typescript",
  "application/xml",
  "application/x-yaml",
  "application/toml",
];

function shouldWrap(mimeType: string, fileName: string): boolean {
  if (WRAP_MIME_PREFIXES.some((p) => mimeType.startsWith(p))) return true;
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return WRAP_EXTENSIONS.has(ext);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getTextWrapHtml(content: string, fileName: string): string {
  const lang = fileName.split(".").pop() ?? "text";
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(fileName)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0f0f0f;
    color: #d4d4d4;
    font-family: 'Geist Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.6;
    padding: 16px;
    overflow: auto;
  }
  .filename {
    color: #666;
    font-size: 11px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #222;
  }
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    tab-size: 2;
  }
</style>
</head>
<body>
<div class="filename">${escapeHtml(fileName)} — ${lang}</div>
<pre>${escapeHtml(content)}</pre>
</body>
</html>`;
}

function getDownloadHtml(fileName: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(fileName)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0f0f0f;
    color: #999;
    font-family: 'Geist Sans', system-ui, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    flex-direction: column;
    gap: 12px;
  }
  .icon { font-size: 32px; opacity: 0.4; }
  .name { color: #ddd; font-size: 14px; }
  .hint { font-size: 12px; }
</style>
</head>
<body>
<div class="icon">📦</div>
<div class="name">${escapeHtml(fileName)}</div>
<div class="hint">Preview not available — download to view</div>
</body>
</html>`;
}

function getImageWrapHtml(dataUrl: string, fileName: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(fileName)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: #0f0f0f; }
  img { display: block; width: 100%; height: 100%; object-fit: contain; }
</style>
</head>
<body>
<img src="${dataUrl}" alt="${escapeHtml(fileName)}">
</body>
</html>`;
}

export type FilePreviewResult = {
  url: string;
  fileName: string;
  nativeWidth?: number;
  nativeHeight?: number;
};

function getImageDimensions(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 0, h: 0 });
    img.src = url;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getVideoDimensions(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.onloadedmetadata = () => resolve({ w: video.videoWidth, h: video.videoHeight });
    video.onerror = () => resolve({ w: 0, h: 0 });
    video.src = url;
  });
}

export async function createFilePreview(
  file: File,
): Promise<FilePreviewResult> {
  const fileName = file.name;
  const mimeType = file.type || "application/octet-stream";

  if (shouldWrap(mimeType, fileName)) {
    const text = await file.text();
    const html = getTextWrapHtml(text, fileName);
    const blob = new Blob([html], { type: "text/html" });
    return { url: URL.createObjectURL(blob), fileName };
  }

  if (mimeType.startsWith("image/") || mimeType === "image/svg+xml") {
    const dataUrl = await fileToDataUrl(file);
    const { w, h } = await getImageDimensions(dataUrl);
    const html = getImageWrapHtml(dataUrl, fileName);
    const blob = new Blob([html], { type: "text/html" });
    return { url: URL.createObjectURL(blob), fileName, nativeWidth: w || undefined, nativeHeight: h || undefined };
  }

  if (mimeType.startsWith("video/")) {
    const url = URL.createObjectURL(file);
    const { w, h } = await getVideoDimensions(url);
    return { url, fileName, nativeWidth: w || undefined, nativeHeight: h || undefined };
  }

  if (
    mimeType.startsWith("audio/") ||
    mimeType === "application/pdf"
  ) {
    return { url: URL.createObjectURL(file), fileName };
  }

  const html = getDownloadHtml(fileName);
  const blob = new Blob([html], { type: "text/html" });
  return { url: URL.createObjectURL(blob), fileName };
}

export function revokeBlobUrl(url: string): void {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
