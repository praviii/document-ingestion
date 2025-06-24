import { Module } from '@nestjs/common';
import { DocumentManagerService } from './services/document-manager.service';
import { DocumentManagerController } from './controller/document-manager.controller';
import { DocumentManagerRepository } from './repository/document-manager.repository';
import { PrismaService } from 'src/DB/prisma.service';

@Module({
  controllers: [DocumentManagerController],
  providers: [DocumentManagerService,DocumentManagerRepository,PrismaService],
})
export class DocumentManagerModule {}
