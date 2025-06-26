import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { PrismaService } from 'src/DB/prisma.service';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let prisma: any;

  beforeEach(async () => {
    const prismaMock = {
      user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    repository = module.get<AuthRepository>(AuthRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('login', () => {
    it('should call prisma.user.findFirst with correct email', async () => {
      const email = 'test@test.com';
      const user = { id: '1', email };
      prisma.user.findFirst.mockResolvedValue(user);
      const result = await repository.login(email);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBe(user);
    });
  });

  describe('getUserById', () => {
    it('should call prisma.user.findUnique with correct id and select role', async () => {
      const userId = '1';
      const user = { id: userId, role: { permissions: ['read'] } };
      prisma.user.findUnique.mockResolvedValue(user);
      const result = await repository.getUserById(userId);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId }, select: { role: true } });
      expect(result).toBe(user);
    });
  });
});
