import { prisma } from "@/lib/prisma";
import { seoDefaults } from "@/lib/seoDefaults";

export async function getPageSeo(path: string): Promise<{ title: string; description: string }> {
  const row = await prisma.pageSeo.findUnique({ where: { path } });
  if (row) return { title: row.title, description: row.description };
  return seoDefaults[path] ?? { title: "WellSight", description: "" };
}
