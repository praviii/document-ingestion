import { Test, TestingModule } from '@nestjs/testing';
import { DocumentManagerController } from './document-manager.controller';
import { DocumentManagerService } from '../services/document-manager.service';
import { Readable } from 'stream';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('DocumentManagerController', () => {
  let controller: DocumentManagerController;
  let service: DocumentManagerService;
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
  const mockRequest = { user: { user_id: userId } } as any;

  class MockAuthGuard {
    canActivate(context: ExecutionContext) {
      return true;
    }
  }
  class MockRolesGuard {
    canActivate(context: ExecutionContext) {
      return true;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentManagerController],
      providers: [{
        provide: DocumentManagerService,
        useValue: {
          createDocument: jest.fn(),
          updateDocument: jest.fn(),
          getDocumentById: jest.fn(),
          uploadDocument: jest.fn(),
        },
      }],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .overrideGuard(RolesGuard)
      .useClass(MockRolesGuard)
      .compile();

    controller = module.get<DocumentManagerController>(DocumentManagerController);
    service = module.get<DocumentManagerService>(DocumentManagerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDocument', () => {
    it('should call uploadDocument on the service', async () => {
      const result = { id: '1', name: 'sample.pdf', fileType: 'application/pdf' };
      (service.uploadDocument as jest.Mock).mockResolvedValue(result);
      const response = await controller.uploadDocument(mockRequest, mockFile);
      expect(service.uploadDocument).toHaveBeenCalledWith(mockFile, userId);
      expect(response).toEqual(result);
    });
  });

  describe('updateDocument', () => {
    it('should call updateDocument on the service', async () => {
      const result = { id: '1', name: 'sample.pdf', fileType: 'application/pdf' };
      const id = '1';
      (service.updateDocument as jest.Mock).mockResolvedValue(result);
      const response = await controller.updateDocument(mockRequest, id, mockFile);
      expect(service.updateDocument).toHaveBeenCalledWith(id, mockFile, userId);
      expect(response).toEqual(result);
    });
  });

  describe('getDocumentById', () => {
    it('should call getDocumentById on the service', async () => {
      const id = '1';
      const result = { id, title: 'Test Document', content: 'This is a test document.' };
      (service.getDocumentById as jest.Mock).mockResolvedValue(result);
      const response = await controller.getDocumentById(id);
      expect(service.getDocumentById).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });

});
