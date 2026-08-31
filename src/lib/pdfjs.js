import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default pdfjsLib;

// Renders one PDF page to a canvas at the given scale (1 = pdf.js's default
// ~96dpi) and returns it as a JPEG data URL — shared by PDF Compressor
// (recompress each page as an image) and PDF Splitter (page thumbnails).
export async function renderPageToDataUrl(pdfPage, scale, quality = 0.85) {
  const viewport = pdfPage.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  await pdfPage.render({ canvasContext: ctx, viewport }).promise;
  return { dataUrl: canvas.toDataURL("image/jpeg", quality), width: canvas.width, height: canvas.height };
}
