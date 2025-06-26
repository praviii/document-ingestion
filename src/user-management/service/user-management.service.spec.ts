
import { UserManagementService } from './user-management.service';
import { UserManagementRepository } from '../repository/user-management.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

describe('UserManagementService', () => {
  let service: UserManagementService;
  let repository: UserManagementRepository;

  const mockUsers = [
    { id: '1', name: 'A', email: 'a@a.com', role: { name: 'admin' } },
    { id: '2', name: 'B', email: 'b@b.com', role: { name: 'user' } },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserManagementService,
        {
          provide: UserManagementRepository,
          useValue: {
            createUser: jest.fn(() => ({ name: 'Test', email: 'test@example.com' })),
            getAllUsers: jest.fn(() => mockUsers),
            getUserById: jest.fn(() => mockUsers[0]),
          },
        },
      ],
    }).compile();
    service = module.get<UserManagementService>(UserManagementService);
    repository = module.get<UserManagementRepository>(UserManagementRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash password and create user', async () => {
      const userData = { name: 'Test', email: 'test@example.com', password: 'pass', roleId: 'role1' };
      const result = await service.createUser(userData);
      expect(repository.createUser).toHaveBeenCalledWith(userData);
      expect(result).toEqual({
        name: 'Test', email: 'test@example.com'
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return mapped users', async () => {
      const result = await service.getAllUsers();
      expect(repository.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual([
        { id: "1", name: 'A', email: 'a@a.com', role: 'admin' },
        { id: "2", name: 'B', email: 'b@b.com', role: 'user' },
      ]);
    });
  });

  describe('getUserById', () => {
    it('should return mapped user by id', async () => {
      const result = await service.getUserById('1');
      expect(repository.getUserById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id:'1',name: 'A', email: 'a@a.com', role: 'admin' });
    });
    it('should throw error if user not found', async () => {
      jest.spyOn(repository, 'getUserById').mockRejectedValue(new NotFoundException('User not found'));
      await expect(service.getUserById('id2')).rejects.toThrow(new NotFoundException('User not found'));
    });
  });
});
