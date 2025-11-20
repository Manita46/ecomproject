const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetIds() {
    try {
        console.log("Resetting Auto Increment IDs...");

        await prisma.$executeRawUnsafe(`ALTER TABLE order AUTO_INCREMENT = 1000`);
        await prisma.$executeRawUnsafe(`ALTER TABLE orderItem AUTO_INCREMENT = 1000`);
        await prisma.$executeRawUnsafe(`ALTER TABLE review AUTO_INCREMENT = 1000`);

        console.log("Auto Increment IDs Reset Successfully!");
    } catch (error) {
        console.error("Error resetting IDs:", error);
    } finally {
        await prisma.$disconnect();
    }
}

resetIds();
