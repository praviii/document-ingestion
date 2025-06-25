import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Req, Get, Patch, Param } from '@nestjs/common';
import { DocumentManagerService } from '../services/document-manager.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('document-manager/document')
@UseGuards(AuthGuard, RolesGuard)
export class DocumentManagerController {
  constructor(private readonly documentManagerService: DocumentManagerService) { }

  @Post('upload')
  @Roles('document:create')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(@Req() request: Request, @UploadedFile() file: Express.Multer.File) {
    const userId = request['user_id'];
    return this.documentManagerService.uploadDocument(file, userId);
  }

  @Get(':id')
  @Roles('document:read')
  getDocumentById(@Param('id') id: string) {
    return this.documentManagerService.getDocumentById(id);
  }

  @Patch(':id')
  @Roles('document:update')
  @UseInterceptors(FileInterceptor('file'))
  updateDocument(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.documentManagerService.updateDocument(id, file, '91121a21-6bdf-40d7-ab87-c4c9cfb1cade');
  }

}
