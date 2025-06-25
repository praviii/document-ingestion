import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DocumentManagerRepository } from '../repository/document-manager.repository';
import { IDocument } from '../model/document.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEvent } from 'src/common/constants/app-events.enum';
import { CreateIngestionDTO, UpdateIngestionDTO } from 'src/common/dto/ingestion.dto';

@Injectable()
export class DocumentManagerService {
    logger = new Logger(DocumentManagerService.name);
    constructor(private readonly DocumentManagerRepo: DocumentManagerRepository,private readonly eventEmitter : EventEmitter2) { }

    async uploadDocument(file: Express.Multer.File, userId: string): Promise<IDocument> {
        try {
            this.logger.log('[uploadDocument] Uploading document:', file.originalname, 'by user:', userId);
            const res = await this.DocumentManagerRepo.uploadDocument(file, '91121a21-6bdf-40d7-ab87-c4c9cfb1cade');
            const document: IDocument = {
                id: res.id,
                name: res.name,
                fileType: res.mimetype,
            }
            this.eventEmitter.emit(AppEvent.CREATE_INGESTION,new CreateIngestionDTO(res.id, userId));
            return document;
        } catch (error) {
            this.logger.error('[uploadDocument] Error uploading document:', error);
            throw new InternalServerErrorException('Failed to upload document');
        }
    }

    async updateDocument(id: string, file: Express.Multer.File, userId: string): Promise<IDocument> {
        try {
            this.logger.log('[updateDocument] Updating document:', id, 'by user:', userId);
            const res = await this.DocumentManagerRepo.updateDocument(id, file, userId);
            const document: IDocument = {
                id: res.id,
                name: res.name,
                fileType: res.mimetype,
            }
            
            const ingestionData = await this.DocumentManagerRepo.getIngestionByDocumentId(res.id);
             this.logger.log('[updateDocument] Getting ingestion using document:', id, 'by user:', userId);

            if (!ingestionData) {
                this.logger.error('[updateDocument] Ingestion not found for document ID:', res.id);
                throw new NotFoundException('Ingestion not found for the document');
            }

            this.eventEmitter.emit(AppEvent.INITIATE_INGESTION_PROCESS, new UpdateIngestionDTO(ingestionData.id, res.id, userId));
            return document;
        } catch (error) {
            this.logger.error('[updateDocument] Error updating document:', error);
            throw new InternalServerErrorException('Failed to update document');
        }
    }

    async getDocumentById(id: string) {
        try {
            this.logger.log('[getDocumentById] Fetching document by ID:', id);
            const res = await this.DocumentManagerRepo.getDocumentById(id);
            if (!res) {
                this.logger.error('[getDocumentById] Document not found for ID:', id);
                throw new NotFoundException('Document not found');
            }
            const document: IDocument = {
                id: res.id,
                name: res.name,
                fileType: res.mimetype,
                createdAt: res.createdAt,
                updatedAt: res.updatedAt,
                createdBy: res.createdBy,
                updatedBy: res.updatedBy
            };
            return document;
        } catch (error) {
            this.logger.error('Error fetching document by ID:', error);
            throw new NotFoundException('Failed to fetch document');
        }
    }
}
