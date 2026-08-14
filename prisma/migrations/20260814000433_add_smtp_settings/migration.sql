-- AlterTable
ALTER TABLE "IntegrationSettings" ADD COLUMN     "smtpHost" TEXT,
ADD COLUMN     "smtpPassword" TEXT,
ADD COLUMN     "smtpPort" INTEGER,
ADD COLUMN     "smtpUser" TEXT;
