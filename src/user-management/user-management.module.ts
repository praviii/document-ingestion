import { Module } from '@nestjs/common';
import { UserManagementService } from './service/user-management.service';
import { UserManagementController } from './controller/user-management.controller';
import { UserManagementRepository } from './repository/user-management.repository';
import { PrismaService } from 'src/DB/prisma.service';

@Module({
  controllers: [UserManagementController],
  providers: [UserManagementService,UserManagementRepository,PrismaService]
})
export class UserManagementModule {}
