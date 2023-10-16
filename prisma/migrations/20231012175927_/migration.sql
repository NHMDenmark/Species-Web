/*
  Warnings:

  - You are about to drop the column `approved_on` on the `folders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `folder_versions` ADD COLUMN `created_by` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `folders` DROP COLUMN `approved_on`,
    ADD COLUMN `approved_at` DATETIME(0) NULL;
