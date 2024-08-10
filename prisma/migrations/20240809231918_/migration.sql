/*
  Warnings:

  - Added the required column `passowrd` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resetPassPhrase` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passowrd" TEXT NOT NULL,
ADD COLUMN     "resetPassPhrase" TEXT NOT NULL;
