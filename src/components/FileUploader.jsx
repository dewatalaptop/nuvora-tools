import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function FileUploader({ accept, multiple = false, onFiles, label = "Tarik file ke sini atau klik untuk memilih" }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (files.length > 0) onFiles(multiple ? files : [files[0]]);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-10 text-center transition ${
        dragging ? "border-brand-400 bg-brand-50" : "border-slate-300 bg-slate-50 hover:border-brand-300"
      }`}
    >
      <UploadCloud className="h-8 w-8 text-brand-500" />
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="text-xs text-slate-400">Belum ada file dipilih</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
