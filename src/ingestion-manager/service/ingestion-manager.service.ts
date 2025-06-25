import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IngestionManagerRepository } from '../repository/ingestion-manager.repository';
import pdf from 'pdf-parse';
import { Ingestion } from '../model/ingestion.model';

@Injectable()
export class IngestionManagerService {
    logger = new Logger(IngestionManagerService.name);
    constructor(private readonly ingestionManagerRepo: IngestionManagerRepository) { }

    async createIngestion(documentId: string,userId :string) : Promise<void> {
        try {
            const res = await this.ingestionManagerRepo.createIngestion(documentId);
            this.initiateIngestionProcess(res.id, documentId,userId);
            this.logger.log(`[createIngestion] Ingestion created with ID: ${res.id} for Document ID: ${documentId}`);
        } catch (error) {
            this.logger.error(`[createIngestion] Error creating ingestion for document ID: ${documentId}`, error);
            throw new Error('Failed to create ingestion');
        }
    }

    async initiateIngestionProcess(id: string, documentId: string,userId : string) : Promise<void> {
        try {
            this.logger.log(`[initiateIngestionProcess] Initiating ingestion process for document with ID: ${id}`);

            //getting document data from document table
            const document = await this.ingestionManagerRepo.getDocumentById(documentId);
            if (!document) {
                this.logger.error(`[initiateIngestionProcess] Document not found for ID: ${documentId}`);
                throw new NotFoundException('Document not found');
            }

            const extractedContent = await pdf(Buffer.from(document.file.buffer));
            await this.ingestionManagerRepo.updateIngestion(id, extractedContent.text);

        } catch (error) {
            this.logger.error(`[initiateIngestionProcess] Error occurred while initiating ingestion with ID: ${id}`, error);
            throw new Error('Failed to initiate ingestion process');
        }
    }

    async getIngestionById(id: string) : Promise<Ingestion> {
        try {
            this.logger.log(`[getIngestionById] Fetching ingestion with ID: ${id}`);

            const ingestion = await this.ingestionManagerRepo.getIngestionById(id);
            if (!ingestion) {
                this.logger.error(`[getIngestionById] Ingestion not found for ID: ${id}`);
                throw new NotFoundException('Ingestion not found');
            }

            return ingestion;
        } catch (error) {
            this.logger.error(`[getIngestionById] Error fetching ingestion with ID: ${id}`, error);
            throw new Error('Failed to fetch ingestion');
        }
    }
}
