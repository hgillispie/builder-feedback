/*
  Warnings:

  - You are about to drop the column `editKey` on the `poll` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Poll_editKey_key` ON `poll`;

-- AlterTable
ALTER TABLE `poll` DROP COLUMN `editKey`;
