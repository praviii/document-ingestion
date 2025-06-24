import { Module } from '@nestjs/common';
import { IngestionManagerService } from './ingestion-manager.service';
import { IngestionManagerController } from './ingestion-manager.controller';

@Module({
  controllers: [IngestionManagerController],
  providers: [IngestionManagerService],
})
export class IngestionManagerModule {}
