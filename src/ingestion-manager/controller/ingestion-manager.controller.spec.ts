import { Test, TestingModule } from '@nestjs/testing';
import { IngestionManagerController } from './ingestion-manager.controller';
import { IngestionManagerService } from '../service/ingestion-manager.service';

describe('IngestionManagerController', () => {
  let controller: IngestionManagerController;
  let service: IngestionManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionManagerController],
      providers: [
        {
          provide: IngestionManagerService,
          useValue: {
            getIngestionById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<IngestionManagerController>(IngestionManagerController);
    service = module.get<IngestionManagerService>(IngestionManagerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getIngestionById', () => {
    it('should call getIngestionById on the service', async () => {
      const id = '1';
      const result = { id, content: 'test content' };
      (service.getIngestionById as jest.Mock).mockResolvedValue(result);
      const response = await controller.getIngestionById(id);
      expect(service.getIngestionById).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });
});
