/*
  Warnings:

  - The primary key for the `videos` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "videos" DROP CONSTRAINT "videos_pkey",
ADD CONSTRAINT "videos_pkey" PRIMARY KEY ("id", "lessonId");
