import { Test, TestingModule } from '@nestjs/testing';
import { DocumentManagerService } from './document-manager.service';
import { DocumentManagerRepository } from '../repository/document-manager.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEvent } from 'src/common/constants/app-events.enum';
import { CreateIngestionDTO, UpdateIngestionDTO } from 'src/common/dto/ingestion.dto';
import { Readable } from 'stream';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('DocumentManagerService', () => {
  let service: DocumentManagerService;
  let repository: DocumentManagerRepository;
  let eventEmitter: EventEmitter2;
  const userId = 'user1';
  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'sample.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 1000,
    buffer: Buffer.from('Fake PDF content'),
    destination: '',
    filename: '',
    path: '',
    stream: Readable.from(['Fake PDF content']),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentManagerService,
        {
          provide: DocumentManagerRepository,
          useValue: {
            uploadDocument: jest.fn(),
            updateDocument: jest.fn(),
            getDocumentById: jest.fn(),
            getIngestionByDocumentId: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();
    service = module.get<DocumentManagerService>(DocumentManagerService);
    repository = module.get<DocumentManagerRepository>(DocumentManagerRepository);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadDocument', () => {
    it('should upload document and emit event', async () => {
      const repoRes = { id: '1', name: 'sample.pdf', mimetype: 'application/pdf' };
      (repository.uploadDocument as jest.Mock).mockResolvedValue(repoRes);
      const result = await service.uploadDocument(mockFile, userId);
      expect(repository.uploadDocument).toHaveBeenCalledWith(mockFile, userId);
      expect(eventEmitter.emit).toHaveBeenCalledWith(AppEvent.CREATE_INGESTION, expect.any(CreateIngestionDTO));
      expect(result).toEqual({ id: '1', name: 'sample.pdf', fileType: 'application/pdf' });
    });
  });

  describe('updateDocument', () => {
    it('should update document, emit event, and return document', async () => {
      const repoRes = { id: '1', name: 'sample.pdf', mimetype: 'application/pdf' };
      const ingestionData = { id: 'ing1' };
      (repository.updateDocument as jest.Mock).mockResolvedValue(repoRes);
      (repository.getIngestionByDocumentId as jest.Mock).mockResolvedValue(ingestionData);
      const result = await service.updateDocument('1', mockFile, userId);
      expect(repository.updateDocument).toHaveBeenCalledWith('1', mockFile, userId);
      expect(repository.getIngestionByDocumentId).toHaveBeenCalledWith('1');
      expect(eventEmitter.emit).toHaveBeenCalledWith(AppEvent.INITIATE_INGESTION_PROCESS, expect.any(UpdateIngestionDTO));
      expect(result).toEqual({ id: '1', name: 'sample.pdf', fileType: 'application/pdf' });
    });
    it('should throw NotFoundException if ingestion not found', async () => {
      const repoRes = { id: '1', name: 'sample.pdf', mimetype: 'application/pdf' };
      (repository.updateDocument as jest.Mock).mockResolvedValue(repoRes);
      (repository.getIngestionByDocumentId as jest.Mock).mockResolvedValue(undefined);
      await expect(service.updateDocument('1', mockFile, userId)).rejects.toThrow(new InternalServerErrorException('Failed to update document'));
    });
  });

  describe('getDocumentById', () => {
    it('should return document if found', async () => {
      const repoRes = {
        id: '1', name: 'sample.pdf', mimetype: 'application/pdf', createdAt: new Date(), updatedAt: new Date(), createdBy: userId, updatedBy: userId
      };
      (repository.getDocumentById as jest.Mock).mockResolvedValue(repoRes);
      const result = await service.getDocumentById('1');
      expect(repository.getDocumentById).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        id: '1',
        name: 'sample.pdf',
        fileType: 'application/pdf',
        createdAt: repoRes.createdAt,
        updatedAt: repoRes.updatedAt,
        createdBy: userId,
        updatedBy: userId,
      });
    });
    it('should throw NotFoundException if document not found', async () => {
      (repository.getDocumentById as jest.Mock).mockResolvedValue(undefined);
      await expect(service.getDocumentById('1')).rejects.toThrow(new NotFoundException('Failed to fetch document'));
    });
  });
});
