-- CreateTable
CREATE TABLE `specimen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guid` VARCHAR(100) NULL,
    `digitiser` VARCHAR(100) NULL,
    `date_asset_taken` VARCHAR(100) NULL,
    `image_file` VARCHAR(100) NULL,
    `checksum` VARCHAR(100) NULL,
    `folder_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `specimen` ADD CONSTRAINT `specimen_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
