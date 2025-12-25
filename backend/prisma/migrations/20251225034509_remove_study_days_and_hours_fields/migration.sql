/*
  Warnings:

  - You are about to drop the column `hours_per_day` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `study_days_per_week` on the `schedules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "hours_per_day",
DROP COLUMN "study_days_per_week";
