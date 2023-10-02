-- CreateTable
CREATE TABLE `covers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(100) NULL,
    `label` VARCHAR(100) NULL,
    `ocr_read_json` TEXT NULL,
    `area` VARCHAR(100) NULL,
    `family` VARCHAR(100) NULL,
    `genus` VARCHAR(100) NULL,
    `species` VARCHAR(100) NULL,
    `variety` VARCHAR(100) NULL,
    `subsp` VARCHAR(100) NULL,
    `gbif_match_json` TEXT NULL,
    `highest_classification` VARCHAR(100) NULL,
    `flagged` BOOLEAN NULL,
    `approved` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

