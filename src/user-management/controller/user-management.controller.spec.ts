import { Test, TestingModule } from '@nestjs/testing';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from '../service/user-management.service';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from '../dto/create-user-management.dto';

describe('UserManagementController', () => {
  let controller: UserManagementController;
  let service: UserManagementService;

  const mockData = {
    name: 'Test User',
    email: 'abc@gmail.com',
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserManagementController],
      providers: [{
        provide: UserManagementService,
        useValue: {
          createUser: jest.fn(() => mockData),
          getAllUsers: jest.fn(),
          getUserById: jest.fn(),
        },
      }],
    }).compile();

    controller = module.get<UserManagementController>(UserManagementController);
    service = module.get<UserManagementService>(UserManagementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('creating a user', () => {
    it('should call createUser on the service', async () => {
      const userData = {
        name: 'Test User',
        email: 'abc@gmail.com',
        password: 'password123',
        roleId: 'role-12345',
      };

      const result = await controller.createUser(userData);
      expect(service.createUser).toHaveBeenCalledWith(userData);
      expect(result).toEqual({
        data: mockData,
        "message": "User created successfully",
        "success": true,
      });
    })

    it("should throw an error if email is invalid", async () => {
      const invalidData = {
        name: 'Test User',
        email: 'abc',
        password: 'password123',
        roleId: 'role-12345',
      };

      const dtoInstance = plainToInstance(CreateUserDto, invalidData);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    })
  })

  describe('getting all users', () => {
    it('should call getAllUsers on the service', async () => {
      const mockUsers = [
        { id: '1', name: 'User One', email: 'one@gmail.com', role: 'Admin' },
        { id: '2', name: 'User Two', email: 'two@gmail.com', role: 'User' },
      ];
      jest.spyOn(service, 'getAllUsers').mockResolvedValue(mockUsers);
      const result = await controller.getAllUsers();
      expect(service.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockUsers,
        message: 'Users retrieved successfully',
        success: true,
      });
    });
  });

  describe('getting user by id', () => {
    it('should call getUserById on the service', async () => {
      const mockUser = { id: '1', name: 'User One', email: 'one@gmail.com', role: 'Admin' };
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);
      const result = await controller.getUserById('1');
      expect(service.getUserById).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        data: mockUser,
        message: 'User retrieved successfully',
        success: true,
      });
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(service, 'getUserById').mockRejectedValue(new BadRequestException('User not found'));
      await expect(controller.getUserById('abc')).rejects.toThrow(BadRequestException);
    });
  });

});
