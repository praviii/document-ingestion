import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.role.create({
        data: {
            id:"b976f3c4-5551-4a23-82fd-23138abf5da2",
            name: 'Admin',
            permissions: [
                'document:read',
                'document:create',
                'document:update',
                'document:delete',
                'ingestion:read',
                'ingestion:create',
                'ingestion:update',
                'ingestion:delete',
                'user:read',
                'user:create',
                'user:update',
                'user:delete',
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    await prisma.role.create({
        data: {
            id:"c56db4c0-1350-493a-a2d9-dc091d2c3019",
            name: 'Viewer',
            permissions: [
                'document:read',
                'ingestion:read',
                'user:read',
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    console.log('✅ Admin adn viewer role seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
