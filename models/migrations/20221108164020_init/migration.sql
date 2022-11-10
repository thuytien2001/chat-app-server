/*
  Warnings:

  - You are about to drop the `SyncDataOffline` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SyncDataOffline" DROP CONSTRAINT "SyncDataOffline_userId_fkey";

-- DropTable
DROP TABLE "SyncDataOffline";
