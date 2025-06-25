import { Module } from '@nestjs/common';
import { UserManagementModule } from './user-management/user-management.module';
import { AuthModule } from './auth/auth.module';
import { DocumentManagerModule } from './document-manager/document-manager.module';
import { IngestionManagerModule } from './ingestion-manager/ingestion-manager.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [ EventEmitterModule.forRoot(),UserManagementModule, AuthModule, DocumentManagerModule, IngestionManagerModule,
  ]
})
export class AppModule { }
