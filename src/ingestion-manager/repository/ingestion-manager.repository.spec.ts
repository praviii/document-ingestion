import { Test, TestingModule } from '@nestjs/testing';
import { IngestionManagerRepository } from './ingestion-manager.repository';
import { PrismaService } from 'src/DB/prisma.service';

describe('IngestionManagerRepository', () => {
  let repository: IngestionManagerRepository;
  let prisma: any;

  beforeEach(async () => {
    const prismaMock = {
      ingestion: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
      },
      document: {
        findUnique: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionManagerRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    repository = module.get<IngestionManagerRepository>(IngestionManagerRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createIngestion', () => {
    it('should call prisma.ingestion.create with correct data', async () => {
      const documentId = 'doc1';
      const created = { id: 'ing1', documentId };
      prisma.ingestion.create.mockResolvedValue(created);
      const result = await repository.createIngestion(documentId);
      expect(prisma.ingestion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          documentId,
          content: '',
          status: 'IN_PROGRESS',
        }),
      });
      expect(result).toBe(created);
    });
  });

  describe('updateIngestion', () => {
    it('should call prisma.ingestion.update with correct data', async () => {
      const id = 'ing1';
      const ingestionData = 'content';
      const updated = { id, content: ingestionData };
      prisma.ingestion.update.mockResolvedValue(updated);
      const result = await repository.updateIngestion(id, ingestionData);
      expect(prisma.ingestion.update).toHaveBeenCalledWith({
        where: { id },
        data: expect.objectContaining({
          content: ingestionData,
          status: 'COMPLETED',
        }),
      });
      expect(result).toBe(updated);
    });
  });

  describe('getIngestionById', () => {
    it('should call prisma.ingestion.findFirst with correct id', async () => {
      const id = 'ing1';
      const ingestion = { id, content: 'test' };
      prisma.ingestion.findFirst.mockResolvedValue(ingestion);
      const result = await repository.getIngestionById(id);
      expect(prisma.ingestion.findFirst).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(ingestion);
    });
  });

  describe('getDocumentById', () => {
    it('should call prisma.document.findUnique with correct id', async () => {
      const documentId = 'doc1';
      const doc = { id: documentId, name: 'doc.pdf' };
      prisma.document.findUnique.mockResolvedValue(doc);
      const result = await repository.getDocumentById(documentId);
      expect(prisma.document.findUnique).toHaveBeenCalledWith({ where: { id: documentId } });
      expect(result).toBe(doc);
    });
  });
});
