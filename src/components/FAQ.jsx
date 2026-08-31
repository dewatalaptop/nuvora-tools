import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ({ items, title = "Pertanyaan Umum" }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section>
      {title && <h2 className="mb-4 text-xl font-bold text-navy-800">{title}</h2>}
      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium text-navy-800">{item.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
              </button>
              {open && <p className="px-5 pb-4 text-sm text-slate-600">{item.a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
