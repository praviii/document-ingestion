import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { DocumentManagerService } from '../services/document-manager.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('document-manager')
@UseGuards(AuthGuard,RolesGuard)
export class DocumentManagerController {
  constructor(private readonly documentManagerService: DocumentManagerService) {}

  @Post('upload-document')
  @Roles('document:create')
  @UseInterceptors(FileInterceptor('file'))
  createDocument() {
    return { message: 'Document created successfully' };
  }
}
