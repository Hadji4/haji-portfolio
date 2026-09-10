-- AlterTable
ALTER TABLE `AdminUser` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `SiteSettings` ADD COLUMN `heroPhotoUrl` VARCHAR(191) NULL;
