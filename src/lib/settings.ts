import { prisma } from "@/lib/prisma";

export async function getIntegrationSettings() {
  return prisma.integrationSettings.findUnique({ where: { id: 1 } });
}
