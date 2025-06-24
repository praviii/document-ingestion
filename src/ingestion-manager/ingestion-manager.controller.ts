import { Controller } from '@nestjs/common';
import { IngestionManagerService } from './ingestion-manager.service';

@Controller('ingestion-manager')
export class IngestionManagerController {
  constructor(private readonly ingestionManagerService: IngestionManagerService) {}
}
