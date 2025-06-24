import { Injectable } from '@nestjs/common';
import { DocumentManagerRepository } from '../repository/document-manager.repository';

@Injectable()
export class DocumentManagerService {
    constructor(private DocumentManagerRepo : DocumentManagerRepository) {}

    uplaodDocument(file: Express.Multer.File) {

    }
}
