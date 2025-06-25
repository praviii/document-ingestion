import { Injectable } from "@nestjs/common";
import { IngestionManagerService } from "./service/ingestion-manager.service";
import { OnEvent } from "@nestjs/event-emitter";
import { AppEvent } from "src/common/constants/app-events.enum";
import { CreateIngestionDTO, UpdateIngestionDTO } from "src/common/dto/ingestion.dto";
@Injectable()
export class IngestionListener {
    constructor(private readonly ingestionManagerService: IngestionManagerService) { }

    @OnEvent(AppEvent.CREATE_INGESTION)
    createIngestion(payload: CreateIngestionDTO): void {
        this.ingestionManagerService.createIngestion(payload.documentId, payload.userId);
    }

    @OnEvent(AppEvent.INITIATE_INGESTION_PROCESS)
    initiateIngestionProcess(payload: UpdateIngestionDTO): void {
        this.ingestionManagerService.initiateIngestionProcess(payload.id, payload.documentId, payload.userId);
    }
}