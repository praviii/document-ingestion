import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/DB/prisma.service";

@Injectable()
export class IngestionManagerRepository {
    constructor(private readonly prismaSvc: PrismaService) { }

    createIngestion(documentId: string) {
        return this.prismaSvc.ingestion.create({
            data: {
                documentId,
                content: '',
                status: 'IN_PROGRESS',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }

    updateIngestion(id: string, ingestionData: string) {
        return this.prismaSvc.ingestion.update({
            where: { id },
            data: {
                content: ingestionData,
                updatedAt: new Date(),
                status: 'COMPLETED'
            }
        });
    }

    getIngestionById(id: string) {
        return this.prismaSvc.ingestion.findFirst({
            where: { id }
        });
    }

    getDocumentById(documentId: string) {
        return this.prismaSvc.document.findUnique({
            where: { id: documentId }
        });
    }
}