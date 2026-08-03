import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";
import { business, services, packages } from "../src/lib/content";
import { seoDefaults } from "../src/lib/seoDefaults";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  await prisma.businessInfo.deleteMany();
  await prisma.businessInfo.create({
    data: {
      name: business.name,
      tagline: business.tagline,
      email: business.email,
      phone: business.phone,
      whatsapp: business.whatsapp,
      street: business.address.street,
      postalCode: business.address.postalCode,
      city: business.address.city,
      country: business.address.country,
      countryCode: business.address.countryCode,
      hoursWeekdays: business.hours[0]?.hours ?? "",
      hoursWeekend: business.hours[1]?.hours ?? "",
    },
  });

  for (const [i, service] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        slug: service.slug,
        name: service.name,
        shortDescription: service.shortDescription,
        duration: service.duration,
        fee: service.fee,
        priceCents: service.priceCents,
        includes: service.includes,
        status: service.status,
        detail: service.detail.join("\n\n"),
        sortOrder: i,
      },
    });
  }

  const existingPackages = await prisma.package.count();
  if (existingPackages === 0) {
    for (const [i, pkg] of packages.entries()) {
      await prisma.package.create({
        data: {
          name: pkg.name,
          description: pkg.description,
          fee: pkg.fee,
          originalFee: pkg.originalFee,
          note: pkg.note,
          sortOrder: i,
        },
      });
    }
  }

  for (const [path, { title, description }] of Object.entries(seoDefaults)) {
    await prisma.pageSeo.upsert({
      where: { path },
      update: {},
      create: { path, title, description },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { passwordHash: hashPassword(adminPassword) },
      create: { email: adminEmail, passwordHash: hashPassword(adminPassword) },
    });
    console.log(`Admin user ready: ${adminEmail}`);
  } else {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipped admin user creation.");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
