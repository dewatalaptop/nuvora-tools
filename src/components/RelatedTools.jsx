import ToolCard from "./ToolCard.jsx";
import { getRelatedTools } from "../data/tools.js";

export default function RelatedTools({ tool }) {
  const related = getRelatedTools(tool);
  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-navy-800">Tools yang Mungkin Kamu Butuhkan</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </section>
  );
}
