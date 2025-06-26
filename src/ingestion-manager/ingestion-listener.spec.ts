import { Test, TestingModule } from '@nestjs/testing';
import { IngestionListener } from './ingestion.listener';
import { IngestionManagerService } from './service/ingestion-manager.service';
import { CreateIngestionDTO, UpdateIngestionDTO } from 'src/common/dto/ingestion.dto';

describe('IngestionListener', () => {
  let listener: IngestionListener;
  let service: IngestionManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionListener,
        {
          provide: IngestionManagerService,
          useValue: {
            createIngestion: jest.fn(),
            initiateIngestionProcess: jest.fn(),
          },
        },
      ],
    }).compile();
    listener = module.get<IngestionListener>(IngestionListener);
    service = module.get<IngestionManagerService>(IngestionManagerService);
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('createIngestion', () => {
    it('should call service.createIngestion with correct payload', () => {
      const payload: CreateIngestionDTO = { documentId: 'doc1', userId: 'user1' };
      listener.createIngestion(payload);
      expect(service.createIngestion).toHaveBeenCalledWith('doc1', 'user1');
    });
  });

  describe('initiateIngestionProcess', () => {
    it('should call service.initiateIngestionProcess with correct payload', () => {
      const payload: UpdateIngestionDTO = { id: 'ing1', documentId: 'doc1', userId: 'user1' };
      listener.initiateIngestionProcess(payload);
      expect(service.initiateIngestionProcess).toHaveBeenCalledWith('ing1', 'doc1', 'user1');
    });
  });
});
