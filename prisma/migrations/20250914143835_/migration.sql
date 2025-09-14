/*
  Warnings:

  - You are about to drop the column `name` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `City` table. All the data in the column will be lost.
  - Added the required column `city` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `City` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."City" DROP COLUMN "name",
DROP COLUMN "postalCode",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL;
