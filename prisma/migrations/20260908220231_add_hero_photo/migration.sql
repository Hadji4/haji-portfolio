-- AlterTable
ALTER TABLE `adminuser` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `sitesettings` ADD COLUMN `heroPhotoUrl` VARCHAR(191) NULL;
