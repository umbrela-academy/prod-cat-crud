-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parentId` INTEGER NULL,
    `name` VARCHAR(500) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'DELETE') NOT NULL DEFAULT 'PENDING',
    `image` INTEGER NOT NULL,

    UNIQUE INDEX `Category_image_key`(`image`),
    INDEX `Category_parentId_fkey`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destination` VARCHAR(255) NOT NULL,
    `originalname` VARCHAR(50) NOT NULL,
    `filename` VARCHAR(100) NOT NULL,
    `mimetype` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `parentId` INTEGER NULL,
    `name` VARCHAR(1000) NOT NULL,
    `description` VARCHAR(10000) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'DELETE') NOT NULL DEFAULT 'PENDING',

    INDEX `Product_categoryId_fkey`(`categoryId`),
    INDEX `Product_parentId_fkey`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destination` VARCHAR(255) NOT NULL,
    `originalname` VARCHAR(50) NOT NULL,
    `filename` VARCHAR(100) NOT NULL,
    `mimetype` VARCHAR(20) NOT NULL,
    `productId` INTEGER NOT NULL,

    INDEX `ProductImage_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Highlight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(2000) NOT NULL,
    `productId` INTEGER NOT NULL,

    INDEX `Highlight_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_image_fkey` FOREIGN KEY (`image`) REFERENCES `CategoryImage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Highlight` ADD CONSTRAINT `Highlight_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
