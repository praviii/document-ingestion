import { Test, TestingModule } from '@nestjs/testing';
import { DocumentManagerController } from './document-manager.controller';
import { DocumentManagerService } from '../services/document-manager.service';

describe('DocumentManagerController', () => {
  let controller: DocumentManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentManagerController],
      providers: [DocumentManagerService],
    }).compile();

    controller = module.get<DocumentManagerController>(DocumentManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
