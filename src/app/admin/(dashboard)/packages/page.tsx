import { prisma } from "@/lib/prisma";
import { createPackage, updatePackage, deletePackage } from "./actions";

const inputClass =
  "w-full border border-outline-variant focus:border-primary rounded-lg p-2.5 bg-surface-container-lowest text-sm";
const labelClass = "text-label-md text-on-surface-variant uppercase tracking-widest";

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-headline-md text-primary mb-8">Packages & Offers</h1>

      <div className="space-y-6">
        {packages.map((pkg) => (
          <form
            key={pkg.id}
            action={updatePackage.bind(null, pkg.id)}
            className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow space-y-4"
          >
            <div className="space-y-1">
              <label className={labelClass}>Name</label>
              <input name="name" defaultValue={pkg.name} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                defaultValue={pkg.description}
                rows={2}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Fee</label>
                <input name="fee" defaultValue={pkg.fee ?? ""} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Original fee</label>
                <input
                  name="originalFee"
                  defaultValue={pkg.originalFee ?? ""}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Note</label>
                <input name="note" defaultValue={pkg.note ?? ""} className={inputClass} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
              >
                Save
              </button>
              <button
                formAction={deletePackage.bind(null, pkg.id)}
                className="text-error text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>

      <h2 className="font-display text-headline-sm text-primary mt-12 mb-4">Add a package</h2>
      <form
        action={createPackage}
        className="bg-surface-container rounded-xl p-6 space-y-4 border border-dashed border-outline-variant"
      >
        <div className="space-y-1">
          <label className={labelClass}>Name</label>
          <input name="name" required className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Description</label>
          <textarea name="description" rows={2} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Fee</label>
            <input name="fee" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Original fee</label>
            <input name="originalFee" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Note</label>
            <input name="note" className={inputClass} />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
        >
          Add package
        </button>
      </form>
    </div>
  );
}
