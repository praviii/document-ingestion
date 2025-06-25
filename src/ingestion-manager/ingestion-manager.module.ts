import { Module } from '@nestjs/common';
import { IngestionManagerService } from './service/ingestion-manager.service';
import { IngestionManagerController } from './controller/ingestion-manager.controller';
import { IngestionManagerRepository } from './repository/ingestion-manager.repository';
import { PrismaService } from 'src/DB/prisma.service';
import { IngestionListener } from './ingestion.listener';

@Module({
  controllers: [IngestionManagerController],
  providers: [IngestionManagerService, IngestionManagerRepository, PrismaService,IngestionListener]
})
export class IngestionManagerModule { }
