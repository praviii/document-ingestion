import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.role.upsert({
        where: { id: 'Admin' },
        update: {},
        create: {
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
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    console.log('✅ Admin role seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
