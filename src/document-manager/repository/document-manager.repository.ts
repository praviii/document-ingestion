import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/DB/prisma.service";

@Injectable()
export class DocumentManagerRepository {
    constructor(private readonly prismaSvc: PrismaService) { }

    uploadDocument(file: Express.Multer.File, userId: string) {
        return this.prismaSvc.document.create({
            data: {
                name: file.originalname,
                mimetype: file.mimetype,
                file: file.buffer,
                createdBy: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
                updatedBy: userId
            }
        })
    }

    updateDocument(id: string, file: Express.Multer.File, userId: string) {
        return this.prismaSvc.document.update({
            where: { id },
            data: {
                name: file.originalname,
                mimetype: file.mimetype,
                file: file.buffer,
                updatedBy: userId,
                updatedAt: new Date()
            }
        });
    }

    getDocumentById(id: string) {
        return this.prismaSvc.document.findUnique({
            where: { id }
        });
    }

    getIngestionByDocumentId(documentId: string) {
        return this.prismaSvc.ingestion.findFirst({
            where: { documentId }
        });
    }
}