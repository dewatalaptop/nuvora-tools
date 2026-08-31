import { useState } from "react";
import { Delete } from "lucide-react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { evaluateExpression } from "../../lib/mathParser.js";

const tool = getToolBySlug("scientific-calculator");

const BUTTON_ROWS = [
  ["sin(", "cos(", "tan(", "(", ")"],
  ["log(", "ln(", "sqrt(", "^", "!"],
  ["7", "8", "9", "/", "pi"],
  ["4", "5", "6", "*", "e"],
  ["1", "2", "3", "-", "C"],
  ["0", ".", "⌫", "+", "="],
];

export default function ScientificCalculatorPage() {
  const [expr, setExpr] = useState("");
  const [display, setDisplay] = useState("0");
  const [error, setError] = useState("");
  const [angleMode, setAngleMode] = useState("deg");
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);

  function press(key) {
    if (key === "C") {
      setExpr("");
      setDisplay("0");
      setError("");
      return;
    }
    if (key === "⌫") {
      setExpr((e) => e.slice(0, -1));
      return;
    }
    if (key === "=") {
      try {
        const result = evaluateExpression(expr, angleMode);
        setHistory((h) => [{ expr, result }, ...h].slice(0, 10));
        setDisplay(String(result));
        setExpr(String(result));
        setError("");
      } catch (err) {
        setError(err.message);
      }
      return;
    }
    setExpr((e) => e + key);
    setError("");
  }

  function memoryOp(op) {
    let current;
    try {
      current = evaluateExpression(expr || display, angleMode);
    } catch {
      current = 0;
    }
    if (op === "M+") setMemory((m) => m + current);
    else if (op === "M-") setMemory((m) => m - current);
    else if (op === "MR") {
      setExpr((e) => e + String(memory));
    } else if (op === "MC") setMemory(0);
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Scientific Calculator Online Gratis"
      seoDescription="Kalkulator ilmiah lengkap dengan fungsi trigonometri, logaritma, memori, dan riwayat perhitungan — langsung di browser."
      howTo={["Ketik ekspresi menggunakan tombol.", "Tekan = untuk menghitung.", "Gunakan M+/M-/MR/MC untuk memori."]}
      faq={[{ q: "Apakah trigonometri pakai derajat atau radian?", a: "Bisa dipilih lewat tombol DEG/RAD di atas kalkulator." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-1">
            {["deg", "rad"].map((m) => (
              <button
                key={m}
                onClick={() => setAngleMode(m)}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition ${
                  angleMode === m ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-500"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {["MC", "MR", "M-", "M+"].map((op) => (
              <button key={op} onClick={() => memoryOp(op)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">
                {op}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 p-4 text-right">
          <p className="min-h-[1.25rem] truncate text-sm text-slate-400">{expr || " "}</p>
          <p className="truncate text-3xl font-bold text-white">{error || display}</p>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-2">
          {BUTTON_ROWS.flat().map((key) => (
            <button
              key={key}
              onClick={() => press(key)}
              className={`rounded-xl py-3 text-sm font-semibold transition ${
                key === "="
                  ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white"
                  : key === "C" || key === "⌫"
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-slate-100 text-navy-800 hover:bg-slate-200"
              }`}
            >
              {key === "⌫" ? <Delete className="mx-auto h-4 w-4" /> : key}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Riwayat</p>
          <div className="space-y-1.5">
            {history.map((h, i) => (
              <button key={i} onClick={() => { setExpr(String(h.result)); setDisplay(String(h.result)); }} className="block w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50">
                <span className="text-slate-400">{h.expr} = </span>
                <span className="font-medium text-navy-800">{h.result}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
