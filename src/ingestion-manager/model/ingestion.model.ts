export interface Ingestion {
    id: string;
    content: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    createdAt: Date;
    updatedAt: Date;
    documentId: string;
}