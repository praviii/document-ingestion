export class CreateIngestionDTO{
    documentId: string;
    userId :string
    constructor(documentId :string, userId: string) {
        this.documentId = documentId;
        this.userId = userId;
    }
}

export class UpdateIngestionDTO {
    id: string;
    documentId: string;
    userId: string;

    constructor(id: string, documentId: string, userId: string) {
        this.id = id;
        this.documentId = documentId;
        this.userId = userId;
    }
}