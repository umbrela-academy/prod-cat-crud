-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_image_fkey`;

-- DropForeignKey
ALTER TABLE `Highlight` DROP FOREIGN KEY `Highlight_productId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductImage` DROP FOREIGN KEY `ProductImage_productId_fkey`;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_image_fkey` FOREIGN KEY (`image`) REFERENCES `CategoryImage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Highlight` ADD CONSTRAINT `Highlight_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
