import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call login on the service', async () => {
      const body = { email: 'test@test.com', password: 'pass' };
      const result = { access_token: 'token', user: { email: 'test@test.com', id: '1' } };
      (service.login as jest.Mock).mockResolvedValue(result);
      const response = await controller.login(body);
      expect(service.login).toHaveBeenCalledWith(body.email, body.password);
      expect(response).toEqual(result);
    });
  });
});
