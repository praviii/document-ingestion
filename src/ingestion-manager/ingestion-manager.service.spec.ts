import { Test, TestingModule } from '@nestjs/testing';
import { IngestionManagerService } from './ingestion-manager.service';

describe('IngestionManagerService', () => {
  let service: IngestionManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestionManagerService],
    }).compile();

    service = module.get<IngestionManagerService>(IngestionManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
