-- Old exception rows have no format info and can't be meaningfully
-- backfilled; their only effect was preventing a previously-deleted slot
-- from being regenerated, so losing that history is low-risk (worst case
-- a once-deleted slot briefly reappears and needs deleting again).
TRUNCATE TABLE "AvailabilityException";

-- DropIndex
DROP INDEX "AvailabilityException_serviceId_startsAt_key";

-- AlterTable
ALTER TABLE "AvailabilityException" ADD COLUMN "format" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityException_serviceId_startsAt_format_key" ON "AvailabilityException"("serviceId", "startsAt", "format");
