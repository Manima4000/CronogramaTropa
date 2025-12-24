/*
  Warnings:

  - Added the required column `start_time` to the `schedule_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule_items" ADD COLUMN     "start_time" TEXT NOT NULL;
