import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserManagementModule } from './user-management/user-management.module';
import { Authmodule } from './auth/auth.module';
import { DocumentManagerModule } from './document-manager/document-manager.module';
import { IngestionManagerModule } from './ingestion-manager/ingestion-manager.module';

@Module({
  imports: [UserManagementModule,Authmodule, DocumentManagerModule, IngestionManagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
