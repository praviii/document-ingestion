import { Test, TestingModule } from '@nestjs/testing';
import { IngestionManagerService } from './ingestion-manager.service';
import { IngestionManagerRepository } from '../repository/ingestion-manager.repository';
import pdf from 'pdf-parse';
import { NotFoundException } from '@nestjs/common';

jest.mock('pdf-parse', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('IngestionManagerService', () => {
  let service: IngestionManagerService;
  let repository: IngestionManagerRepository;
  const documentId = 'doc1';
  const userId = 'user1';
  const ingestionId = 'ing1';

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // silence error logs
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionManagerService,
        {
          provide: IngestionManagerRepository,
          useValue: {
            createIngestion: jest.fn(),
            updateIngestion: jest.fn(),
            getIngestionById: jest.fn(),
            getDocumentById: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<IngestionManagerService>(IngestionManagerService);
    repository = module.get<IngestionManagerRepository>(IngestionManagerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createIngestion', () => {
    it('should create ingestion and initiate process', async () => {
      const res = { id: ingestionId };
      (repository.createIngestion as jest.Mock).mockResolvedValue(res);
      const spy = jest.spyOn(service, 'initiateIngestionProcess').mockResolvedValue();
      await service.createIngestion(documentId, userId);
      expect(repository.createIngestion).toHaveBeenCalledWith(documentId);
      expect(spy).toHaveBeenCalledWith(ingestionId, documentId, userId);
    });
    it('should log and throw error if createIngestion fails', async () => {
      (repository.createIngestion as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(service.createIngestion(documentId, userId)).rejects.toThrow('Failed to create ingestion');
    });
  });

  describe('initiateIngestionProcess', () => {
    it('should update ingestion with extracted content', async () => {
      const document = { file: { buffer: Buffer.from('pdf') } };
      (repository.getDocumentById as jest.Mock).mockResolvedValue(document);
      (repository.updateIngestion as jest.Mock).mockResolvedValue(undefined);
      (pdf as jest.Mock).mockResolvedValue({ text: 'content' } as any);
      await service.initiateIngestionProcess(ingestionId, documentId, userId);
      expect(repository.getDocumentById).toHaveBeenCalledWith(documentId);
      expect(repository.updateIngestion).toHaveBeenCalledWith(ingestionId, 'content');
    });
    it('should throw NotFoundException if document not found', async () => {
      (repository.getDocumentById as jest.Mock).mockResolvedValue(undefined);
      await expect(service.initiateIngestionProcess(ingestionId, documentId, userId)).rejects.toThrow('Failed to initiate ingestion process');
    });
    it('should log and throw error if updateIngestion fails', async () => {
      const document = { file: { buffer: Buffer.from('pdf') } };
      (repository.getDocumentById as jest.Mock).mockResolvedValue(document);
      (repository.updateIngestion as jest.Mock).mockRejectedValue(new Error('fail'));
      (pdf as jest.Mock).mockResolvedValue({ text: 'content' } as any);
      await expect(service.initiateIngestionProcess(ingestionId, documentId, userId)).rejects.toThrow('Failed to initiate ingestion process');
    });
  });

  describe('getIngestionById', () => {
    it('should return ingestion if found', async () => {
      const ingestion = { id: ingestionId, content: 'test content' };
      (repository.getIngestionById as jest.Mock).mockResolvedValue(ingestion);
      const result = await service.getIngestionById(ingestionId);
      expect(repository.getIngestionById).toHaveBeenCalledWith(ingestionId);
      expect(result).toBe(ingestion);
    });
    it('should throw NotFoundException if not found', async () => {
      (repository.getIngestionById as jest.Mock).mockResolvedValue(undefined);
      await expect(service.getIngestionById(ingestionId)).rejects.toThrow(new Error('Failed to fetch ingestion'));
    });
    it('should log and throw error if repository throws', async () => {
      (repository.getIngestionById as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(service.getIngestionById(ingestionId)).rejects.toThrow('Failed to fetch ingestion');
    });
  });
});
