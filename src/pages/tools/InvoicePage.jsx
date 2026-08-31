import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { Plus, Trash2 } from "lucide-react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import DownloadButton from "../../components/DownloadButton.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatRupiah, parseNumber } from "../../lib/format.js";

const tool = getToolBySlug("invoice");

let itemSeq = 0;
function newItem() {
  itemSeq += 1;
  return { id: itemSeq, nama: "", qty: 1, harga: "" };
}

export default function InvoicePage() {
  const [bisnis, setBisnis] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nomorInvoice, setNomorInvoice] = useState("INV-001");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([newItem()]);
  const [diskon, setDiskon] = useState("");
  const [pajak, setPajak] = useState("");

  function updateItem(id, patch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, newItem()]);
  }
  function removeItem(id) {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));
  }

  const calc = useMemo(() => {
    const subtotal = items.reduce((sum, it) => sum + parseNumber(it.qty) * parseNumber(it.harga), 0);
    const nilaiDiskon = subtotal * (parseNumber(diskon) / 100);
    const setelahDiskon = subtotal - nilaiDiskon;
    const nilaiPajak = setelahDiskon * (parseNumber(pajak) / 100);
    const total = setelahDiskon + nilaiPajak;
    return { subtotal, nilaiDiskon, nilaiPajak, total };
  }, [items, diskon, pajak]);

  function downloadPdf() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let y = 20;

    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text(bisnis || "Nama Bisnis", 15, y);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    y += 7;
    if (alamat) {
      doc.text(alamat, 15, y);
      y += 6;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("INVOICE", 195, 20, { align: "right" });
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`No: ${nomorInvoice}`, 195, 27, { align: "right" });
    doc.text(`Tanggal: ${tanggal}`, 195, 32, { align: "right" });

    y = Math.max(y, 32) + 8;
    doc.setFont(undefined, "bold");
    doc.text("Ditagihkan kepada:", 15, y);
    doc.setFont(undefined, "normal");
    y += 5;
    doc.text(customer || "-", 15, y);

    y += 10;
    doc.setFillColor(37, 99, 235);
    doc.rect(15, y, 180, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.text("Item", 18, y + 5.5);
    doc.text("Qty", 130, y + 5.5, { align: "right" });
    doc.text("Harga", 160, y + 5.5, { align: "right" });
    doc.text("Subtotal", 193, y + 5.5, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    y += 8;

    items.forEach((it, i) => {
      const rowY = y + i * 7 + 5;
      if (i % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y + i * 7, 180, 7, "F");
      }
      doc.text(it.nama || "-", 18, rowY);
      doc.text(String(parseNumber(it.qty)), 130, rowY, { align: "right" });
      doc.text(formatRupiah(it.harga), 160, rowY, { align: "right" });
      doc.text(formatRupiah(parseNumber(it.qty) * parseNumber(it.harga)), 193, rowY, { align: "right" });
    });
    y += items.length * 7 + 8;

    const summaryRows = [
      ["Subtotal", formatRupiah(calc.subtotal)],
      ...(parseNumber(diskon) > 0 ? [[`Diskon (${diskon}%)`, `- ${formatRupiah(calc.nilaiDiskon)}`]] : []),
      ...(parseNumber(pajak) > 0 ? [[`Pajak (${pajak}%)`, formatRupiah(calc.nilaiPajak)]] : []),
    ];
    summaryRows.forEach(([label, value], i) => {
      doc.text(label, 150, y + i * 6, { align: "right" });
      doc.text(value, 195, y + i * 6, { align: "right" });
    });
    y += summaryRows.length * 6 + 2;
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Total", 150, y, { align: "right" });
    doc.text(formatRupiah(calc.total), 195, y, { align: "right" });

    doc.save(`${nomorInvoice || "invoice"}.pdf`);
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Generator Invoice Online Gratis"
      seoDescription="Buat invoice sederhana secara gratis, lengkap dengan preview real-time, download PDF, dan cetak langsung."
      howTo={["Isi data bisnis dan customer.", "Tambahkan item, quantity, dan harga.", "Atur diskon/pajak jika perlu.", "Download sebagai PDF atau cetak langsung."]}
      faq={[{ q: "Apakah perlu login untuk membuat invoice?", a: "Tidak, semua data diproses langsung di browser kamu tanpa perlu akun." }]}
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 print:hidden">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Nama bisnis" placeholder="Toko Nuvora" value={bisnis} onChange={(e) => setBisnis(e.target.value)} />
            <InputField label="Alamat" placeholder="Jl. Merdeka No.1" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
            <InputField label="Nomor invoice" value={nomorInvoice} onChange={(e) => setNomorInvoice(e.target.value)} />
            <InputField label="Tanggal" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
            <InputField label="Nama customer" placeholder="Budi Santoso" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-navy-700">Item</p>
            <div className="space-y-2">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-2">
                  <input
                    value={it.nama}
                    onChange={(e) => updateItem(it.id, { nama: e.target.value })}
                    placeholder="Nama item"
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-brand-400"
                  />
                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) => updateItem(it.id, { qty: e.target.value })}
                    placeholder="Qty"
                    className="w-16 rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-brand-400"
                  />
                  <input
                    type="number"
                    value={it.harga}
                    onChange={(e) => updateItem(it.id, { harga: e.target.value })}
                    placeholder="Harga"
                    className="w-28 rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-brand-400"
                  />
                  <button onClick={() => removeItem(it.id)} className="shrink-0 rounded-lg p-2 text-red-400 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="mt-2 flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              <Plus className="h-4 w-4" /> Tambah item
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Diskon" suffix="%" type="number" placeholder="0" value={diskon} onChange={(e) => setDiskon(e.target.value)} />
            <InputField label="Pajak" suffix="%" type="number" placeholder="0" value={pajak} onChange={(e) => setPajak(e.target.value)} />
          </div>

          <div className="flex flex-wrap gap-2">
            <DownloadButton onClick={downloadPdf}>Download PDF</DownloadButton>
            <button onClick={() => window.print()} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Print
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6" id="invoice-preview">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-navy-800">{bisnis || "Nama Bisnis"}</p>
              <p className="text-sm text-slate-500">{alamat}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-navy-800">INVOICE</p>
              <p className="text-sm text-slate-500">No: {nomorInvoice}</p>
              <p className="text-sm text-slate-500">{tanggal}</p>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase text-slate-400">Ditagihkan kepada</p>
            <p className="mt-1 text-sm text-navy-700">{customer || "-"}</p>
          </div>

          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-400">
                <th className="py-2 font-medium">Item</th>
                <th className="py-2 text-right font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Harga</th>
                <th className="py-2 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-slate-50">
                  <td className="py-2 text-navy-700">{it.nama || "-"}</td>
                  <td className="py-2 text-right text-navy-700">{parseNumber(it.qty)}</td>
                  <td className="py-2 text-right text-navy-700">{formatRupiah(it.harga)}</td>
                  <td className="py-2 text-right text-navy-700">{formatRupiah(parseNumber(it.qty) * parseNumber(it.harga))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 ml-auto max-w-[220px] space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatRupiah(calc.subtotal)}</span>
            </div>
            {parseNumber(diskon) > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Diskon ({diskon}%)</span>
                <span>- {formatRupiah(calc.nilaiDiskon)}</span>
              </div>
            )}
            {parseNumber(pajak) > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Pajak ({pajak}%)</span>
                <span>{formatRupiah(calc.nilaiPajak)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-navy-800">
              <span>Total</span>
              <span>{formatRupiah(calc.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
