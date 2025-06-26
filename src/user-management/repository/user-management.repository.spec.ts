import { UserManagementRepository } from './user-management.repository';
import { PrismaService } from '../../DB/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserManagementRepository', () => {
    let repository: UserManagementRepository;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserManagementRepository, {
                provide: PrismaService,
                useValue: {
                    user: {
                        create: jest.fn(),
                        findMany: jest.fn(),
                        findUnique: jest.fn(),
                    },
                },
            }],
        }).compile();

        repository = module.get<UserManagementRepository>(UserManagementRepository);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should call prisma.user.create with correct data', async () => {
        const userData = { name: 'Test', email: 'test@example.com', password: 'pass', roleId: 'role1' };
        const createdUser = { id: '1', ...userData,createdAt: new Date(), updatedAt: new Date() };
        jest.spyOn(prisma.user, 'create').mockResolvedValue(createdUser);
        const result = await repository.createUser(userData);
        expect(result).toBe(createdUser);
    });

    it('should call prisma.user.findMany with correct select', async () => {
        const users = [{ id: '1', name: 'A', email: 'a@a.com', roleId: "123", role: { name: 'admin' }, createdAt: new Date(), updatedAt: new Date(), password: 'hashedPassword' }];
        jest.spyOn(prisma.user, 'findMany').mockResolvedValue(users);
        const result = await repository.getAllUsers();
        expect(result).toBe(users);
    });

    it('should call prisma.user.findUnique with correct where and select', async () => {
        const user = { id: '1', name: 'A', email: 'a@a.com', roleId: "123", role: { name: 'admin' }, createdAt: new Date(), updatedAt: new Date(), password: 'hashedPassword' };
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);
        const result = await repository.getUserById('1');
        expect(result).toBe(user);
    });
});
