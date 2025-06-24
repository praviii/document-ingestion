import { Test, TestingModule } from '@nestjs/testing';
import { IngestionManagerController } from './ingestion-manager.controller';
import { IngestionManagerService } from './ingestion-manager.service';

describe('IngestionManagerController', () => {
  let controller: IngestionManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionManagerController],
      providers: [IngestionManagerService],
    }).compile();

    controller = module.get<IngestionManagerController>(IngestionManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
