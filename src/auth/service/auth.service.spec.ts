import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from '../repository/auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let authRepo: AuthRepository;
  let jwtSvc: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: { login: jest.fn(), getUserById: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    authRepo = module.get<AuthRepository>(AuthRepository);
    jwtSvc = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access_token and user if credentials are valid', async () => {
      const user = { id: '1', email: 'test@test.com', password: 'hashed' };
      const userRole = { role: { permissions: ['read'] } };
      (authRepo.login as jest.Mock).mockResolvedValue(user);
      (authRepo.getUserById as jest.Mock).mockResolvedValue(userRole);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      (jwtSvc.sign as jest.Mock).mockReturnValue('token');
      const result = await service.login('test@test.com', 'password');
      expect(result).toEqual({ access_token: 'token', user: { email: 'test@test.com', id: '1' } });
    });
    it('should throw error if password is invalid', async () => {
      const user = { id: '1', email: 'test@test.com', password: 'hashed' };
      (authRepo.login as jest.Mock).mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      await expect(service.login('test@test.com', 'wrong')).rejects.toThrow('Invalid password');
    });
  });
});
