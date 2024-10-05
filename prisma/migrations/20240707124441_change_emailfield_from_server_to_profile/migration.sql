/*
  Warnings:

  - You are about to drop the column `email` on the `Server` table. All the data in the column will be lost.
  - Added the required column `email` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Server" DROP COLUMN "email";
