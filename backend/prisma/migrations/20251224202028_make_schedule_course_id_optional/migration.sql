-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_courseId_fkey";

-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "courseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
