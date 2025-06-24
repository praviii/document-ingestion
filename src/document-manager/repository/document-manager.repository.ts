import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/DB/prisma.service";

@Injectable()
export class DocumentManagerRepository {
    constructor(private prismaSvc: PrismaService) { }

    uploadDocument(file: Express.Multer.File,userId : string) {
        return this.prismaSvc.document.create({
            data: {
                file: file.buffer,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: userId,
                updatedBy: userId
            }
        })
    }
}