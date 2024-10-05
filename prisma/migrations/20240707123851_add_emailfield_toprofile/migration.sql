/*
  Warnings:

  - Added the required column `email` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "email" TEXT NOT NULL;
