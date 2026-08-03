import { prisma } from "@/lib/prisma";
import { seoDefaults } from "@/lib/seoDefaults";
import { updatePageSeo } from "./actions";

const inputClass =
  "w-full border border-outline-variant focus:border-primary rounded-lg p-2.5 bg-surface-container-lowest text-sm";
const labelClass = "text-label-md text-on-surface-variant uppercase tracking-widest";

const pageLabels: Record<string, string> = {
  "/": "Home",
  "/about-us": "About Us",
  "/our-services": "Our Services",
  "/how-we-meet": "How We Meet",
  "/firstsession": "Starting Therapy",
  "/book-and-pay": "Book a Session",
};

export default async function AdminSeoPage() {
  const rows = await prisma.pageSeo.findMany();
  const byPath = new Map(rows.map((r) => [r.path, r]));

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-headline-md text-primary mb-2">Page Titles & SEO</h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Controls the browser tab title and the description shown in Google search results for
        each page. Character counts are a guideline — Google truncates titles past ~60 and
        descriptions past ~155.
      </p>

      <div className="space-y-6">
        {Object.entries(pageLabels).map(([path, label]) => {
          const current = byPath.get(path) ?? seoDefaults[path];
          return (
            <form
              key={path}
              action={updatePageSeo.bind(null, path)}
              className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-headline-sm text-primary">{label}</h2>
                <span className="text-xs text-on-surface-variant/60 font-mono">{path}</span>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Page title</label>
                <input
                  name="title"
                  defaultValue={current?.title}
                  maxLength={70}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Meta description</label>
                <textarea
                  name="description"
                  defaultValue={current?.description}
                  rows={2}
                  maxLength={170}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
              >
                Save
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
