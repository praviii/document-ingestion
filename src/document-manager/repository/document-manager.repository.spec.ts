import { Test, TestingModule } from '@nestjs/testing';
import { DocumentManagerRepository } from './document-manager.repository';
import { PrismaService } from 'src/DB/prisma.service';

describe('DocumentManagerRepository', () => {
  let repository: DocumentManagerRepository;
  let prisma: any;

  beforeEach(async () => {
    const prismaMock = {
      document: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
      },
      ingestion: {
        findFirst: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentManagerRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    repository = module.get<DocumentManagerRepository>(DocumentManagerRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('uploadDocument', () => {
    it('should call prisma.document.create with correct data', async () => {
      const file = { originalname: 'doc.pdf', mimetype: 'application/pdf', buffer: Buffer.from(''), } as any;
      const userId = 'user1';
      const createdDoc = { id: '1', ...file };
      prisma.document.create.mockResolvedValue(createdDoc);
      const result = await repository.uploadDocument(file, userId);
      expect(prisma.document.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: file.originalname,
          mimetype: file.mimetype,
          file: file.buffer,
          createdBy: userId,
        }),
      });
      expect(result).toBe(createdDoc);
    });
  });

  describe('updateDocument', () => {
    it('should call prisma.document.update with correct data', async () => {
      const file = { originalname: 'doc.pdf', mimetype: 'application/pdf', buffer: Buffer.from(''), } as any;
      const userId = 'user1';
      const id = '1';
      const updatedDoc = { id, ...file };
      prisma.document.update.mockResolvedValue(updatedDoc);
      const result = await repository.updateDocument(id, file, userId);
      expect(prisma.document.update).toHaveBeenCalledWith({
        where: { id },
        data: expect.objectContaining({
          name: file.originalname,
          mimetype: file.mimetype,
          file: file.buffer,
          updatedBy: userId,
        }),
      });
      expect(result).toBe(updatedDoc);
    });
  });

  describe('getDocumentById', () => {
    it('should call prisma.document.findUnique with correct id', async () => {
      const id = '1';
      const doc = { id, name: 'doc.pdf' };
      prisma.document.findUnique.mockResolvedValue(doc);
      const result = await repository.getDocumentById(id);
      expect(prisma.document.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(doc);
    });
  });

  describe('getIngestionByDocumentId', () => {
    it('should call prisma.ingestion.findFirst with correct documentId', async () => {
      const documentId = 'doc1';
      const ingestion = { id: 'ing1', documentId };
      prisma.ingestion.findFirst.mockResolvedValue(ingestion);
      const result = await repository.getIngestionByDocumentId(documentId);
      expect(prisma.ingestion.findFirst).toHaveBeenCalledWith({ where: { documentId } });
      expect(result).toBe(ingestion);
    });
  });
});
