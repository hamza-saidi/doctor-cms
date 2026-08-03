import { prisma } from "@/lib/prisma";
import { createService, updateService, deleteService } from "./actions";

const inputClass =
  "w-full border border-outline-variant focus:border-primary rounded-lg p-2.5 bg-surface-container-lowest text-sm";
const labelClass = "text-label-md text-on-surface-variant uppercase tracking-widest";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-headline-md text-primary mb-8">Services</h1>

      <div className="space-y-6">
        {services.map((service) => (
          <form
            key={service.id}
            action={updateService.bind(null, service.id)}
            className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Name</label>
                <input name="name" defaultValue={service.name} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Status</label>
                <select name="status" defaultValue={service.status} className={inputClass}>
                  <option value="available">Available</option>
                  <option value="comingSoon">Coming soon</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Short description</label>
              <input
                name="shortDescription"
                defaultValue={service.shortDescription}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Duration</label>
                <input name="duration" defaultValue={service.duration} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Fee (display text)</label>
                <input name="fee" defaultValue={service.fee} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Includes</label>
                <input name="includes" defaultValue={service.includes} className={inputClass} />
              </div>
            </div>

            <div className="space-y-1 max-w-[200px]">
              <label className={labelClass}>Exact price (€, for online payment)</label>
              <input
                name="priceEuros"
                type="number"
                step="0.01"
                min="0"
                defaultValue={service.priceCents ? (service.priceCents / 100).toFixed(2) : ""}
                placeholder="e.g. 90.00"
                className={inputClass}
              />
              <p className="text-xs text-on-surface-variant/60">
                Leave blank if this service isn&apos;t billable online yet.
              </p>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Detail (paragraphs, blank line between)</label>
              <textarea
                name="detail"
                defaultValue={service.detail}
                rows={4}
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
              >
                Save
              </button>
              <button
                formAction={deleteService.bind(null, service.id)}
                className="text-error text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>

      <h2 className="font-display text-headline-sm text-primary mt-12 mb-4">Add a service</h2>
      <form
        action={createService}
        className="bg-surface-container rounded-xl p-6 space-y-4 border border-dashed border-outline-variant"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Name</label>
            <input name="name" required className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Status</label>
            <select name="status" defaultValue="available" className={inputClass}>
              <option value="available">Available</option>
              <option value="comingSoon">Coming soon</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Short description</label>
          <input name="shortDescription" className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Duration</label>
            <input name="duration" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Fee</label>
            <input name="fee" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Includes</label>
            <input name="includes" className={inputClass} />
          </div>
        </div>
        <div className="space-y-1 max-w-[200px]">
          <label className={labelClass}>Exact price (€, for online payment)</label>
          <input name="priceEuros" type="number" step="0.01" min="0" placeholder="e.g. 90.00" className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Detail</label>
          <textarea name="detail" rows={3} className={inputClass} />
        </div>
        <button
          type="submit"
          className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
        >
          Add service
        </button>
      </form>
    </div>
  );
}
