export interface IDocument{
    id: string;
    name: string;
    fileType: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
}