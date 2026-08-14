-- Widening the constraint (adding a column) can never conflict with
-- existing data: anything unique on (serviceId, startsAt) alone is
-- certainly still unique on (serviceId, startsAt, format).

-- DropIndex
DROP INDEX "AvailabilitySlot_serviceId_startsAt_key";

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilitySlot_serviceId_startsAt_format_key" ON "AvailabilitySlot"("serviceId", "startsAt", "format");
