-- AlterTable
ALTER TABLE `covers` MODIFY `image` MEDIUMTEXT NULL,
    MODIFY `label` MEDIUMTEXT NULL;

-- CreateTable
CREATE TABLE `folders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` MEDIUMTEXT NULL,
    `label` MEDIUMTEXT NULL,
    `ocr_read_json` TEXT NULL,
    `flagged` BOOLEAN NULL,
    `approved_on` DATETIME(0) NULL,
    `approved_by` MEDIUMTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `folder_versions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `area` VARCHAR(100) NULL,
    `family` VARCHAR(100) NULL,
    `genus` VARCHAR(100) NULL,
    `species` VARCHAR(100) NULL,
    `variety` VARCHAR(100) NULL,
    `subsp` VARCHAR(100) NULL,
    `gbif_match_json` TEXT NULL,
    `highest_classification` VARCHAR(100) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `folder_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `folder_versions` ADD CONSTRAINT `folder_versions_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
