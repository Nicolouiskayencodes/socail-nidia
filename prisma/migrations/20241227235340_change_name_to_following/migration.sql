/*
  Warnings:

  - You are about to drop the `_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_requests" DROP CONSTRAINT "_requests_A_fkey";

-- DropForeignKey
ALTER TABLE "_requests" DROP CONSTRAINT "_requests_B_fkey";

-- DropTable
DROP TABLE "_requests";
