import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import ToolLayout from "../../components/ToolLayout.jsx";
import FileUploader from "../../components/FileUploader.jsx";
import DownloadButton, { triggerDownload } from "../../components/DownloadButton.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { trackEvent } from "../../lib/analytics.js";

const tool = getToolBySlug("image-cropper");

const RATIOS = [
  { key: "free", label: "Bebas", value: null },
  { key: "1:1", label: "1:1", value: 1 },
  { key: "4:3", label: "4:3", value: 4 / 3 },
  { key: "16:9", label: "16:9", value: 16 / 9 },
  { key: "3:4", label: "3:4", value: 3 / 4 },
  { key: "4:6", label: "4:6", value: 4 / 6 },
];

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = url;
  });
}

export default function ImageCropperPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [img, setImg] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [ratio, setRatio] = useState(null);
  const [box, setBox] = useState(null); // {x, y, w, h} in displayed (CSS) px
  const [dragState, setDragState] = useState(null);
  const [format, setFormat] = useState("PNG");
  const [error, setError] = useState("");
  // The crop stage used to be a hardcoded 560px wide, which overflowed on
  // any phone screen — measure the actual available width instead so it
  // scales down on mobile and stays capped at a sensible size on desktop.
  const [stageMaxW, setStageMaxW] = useState(560);
  const stageRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setStageMaxW(Math.min(560, width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [file]);

  const displaySize = img ? fitToStage(img, rotation) : null;

  function fitToStage(image, rot) {
    const maxW = stageMaxW;
    const maxH = 420;
    const swapped = rot % 180 !== 0;
    const iw = swapped ? image.height : image.width;
    const ih = swapped ? image.width : image.height;
    const scale = Math.min(maxW / iw, maxH / ih, 1);
    return { w: iw * scale, h: ih * scale, scale };
  }

  async function handleFiles(files) {
    const f = files[0];
    if (!f.type.startsWith("image/")) return setError("File harus berupa gambar.");
    setError("");
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const image = await loadImage(url);
    setImg(image);
    setRotation(0);
  }

  useEffect(() => {
    if (!img || !displaySize) return;
    const w = Math.min(displaySize.w, displaySize.h) * 0.8;
    const h = ratio ? w / ratio : w;
    setBox({ x: (displaySize.w - w) / 2, y: (displaySize.h - h) / 2, w, h: Math.min(h, displaySize.h) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, rotation, ratio, stageMaxW]);

  function startDrag(e, mode) {
    e.stopPropagation();
    const start = { x: e.clientX, y: e.clientY, box: { ...box } };
    setDragState({ mode, start });
  }

  useEffect(() => {
    if (!dragState) return;
    function onMove(e) {
      const dx = e.clientX - dragState.start.x;
      const dy = e.clientY - dragState.start.y;
      const stage = displaySize;
      setBox(() => {
        let next = { ...dragState.start.box };
        if (dragState.mode === "move") {
          next.x = clamp(next.x + dx, 0, stage.w - next.w);
          next.y = clamp(next.y + dy, 0, stage.h - next.h);
        } else if (dragState.mode === "resize") {
          let w = clamp(next.w + dx, 30, stage.w - next.x);
          let h = ratio ? w / ratio : clamp(next.h + dy, 30, stage.h - next.y);
          if (next.y + h > stage.h) h = stage.h - next.y;
          if (ratio) w = h * ratio;
          next = { ...next, w, h };
        }
        return next;
      });
    }
    function onUp() {
      setDragState(null);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragState, displaySize, ratio]);

  function clamp(v, min, max) {
    if (max < min) return min;
    return Math.min(max, Math.max(min, v));
  }

  function cropAndDownload() {
    if (!img || !box || !displaySize) return;
    const canvas = document.createElement("canvas");
    const scale = 1 / displaySize.scale;
    canvas.width = box.w * scale;
    canvas.height = box.h * scale;
    const ctx = canvas.getContext("2d");

    const rotatedCanvas = document.createElement("canvas");
    const swapped = rotation % 180 !== 0;
    rotatedCanvas.width = swapped ? img.height : img.width;
    rotatedCanvas.height = swapped ? img.width : img.height;
    const rctx = rotatedCanvas.getContext("2d");
    rctx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
    rctx.rotate((rotation * Math.PI) / 180);
    rctx.drawImage(img, -img.width / 2, -img.height / 2);

    ctx.drawImage(rotatedCanvas, box.x * scale, box.y * scale, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    const mime = format === "PNG" ? "image/png" : format === "WebP" ? "image/webp" : "image/jpeg";
    canvas.toBlob((blob) => {
      triggerDownload(blob, `cropped.${format.toLowerCase()}`);
      trackEvent("download", { tool_id: tool.id });
    }, mime, 0.92);
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Image Cropper — Potong Foto Online Gratis"
      seoDescription="Potong (crop) foto dengan rasio bebas atau preset umum (1:1, 4:3, 16:9), langsung di browser tanpa upload ke server."
      howTo={["Upload foto.", "Pilih rasio crop (atau bebas).", "Geser dan sesuaikan area crop.", "Klik Crop & Download."]}
      faq={[{ q: "Apakah foto saya diupload ke server?", a: "Tidak, proses crop dilakukan sepenuhnya di browser kamu." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        {!file ? (
          <FileUploader accept="image/*" onFiles={handleFiles} label="Tarik foto ke sini atau klik untuk memilih" />
        ) : (
          <div ref={wrapperRef}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {RATIOS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRatio(r.value)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    ratio === r.value ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-600"
                  }`}
                >
                  {r.label}
                </button>
              ))}
              <button onClick={() => setRotation((r) => (r + 90) % 360)} className="ml-auto flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
                <RotateCw className="h-4 w-4" /> Putar
              </button>
            </div>

            {img && displaySize && (
              <div
                ref={stageRef}
                className="relative mx-auto touch-none select-none overflow-hidden rounded-xl bg-slate-100"
                style={{ width: displaySize.w, height: displaySize.h }}
              >
                <img
                  src={preview}
                  alt=""
                  draggable={false}
                  className="absolute left-1/2 top-1/2 max-w-none"
                  style={{
                    width: rotation % 180 !== 0 ? displaySize.h : displaySize.w,
                    height: rotation % 180 !== 0 ? displaySize.w : displaySize.h,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                  }}
                />
                {box && (
                  <div
                    onPointerDown={(e) => startDrag(e, "move")}
                    className="absolute cursor-move border-2 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.45)]"
                    style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
                  >
                    <div
                      onPointerDown={(e) => startDrag(e, "resize")}
                      className="absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-nwse-resize rounded-full border-2 border-brand-600 bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400">
                <option>PNG</option>
                <option>JPG</option>
                <option>WebP</option>
              </select>
              <DownloadButton onClick={cropAndDownload}>Crop &amp; Download</DownloadButton>
              <button onClick={() => setFile(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Ganti Foto
              </button>
            </div>
          </div>
        )}
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
      </div>
    </ToolLayout>
  );
}
