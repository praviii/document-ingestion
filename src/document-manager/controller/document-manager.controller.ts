import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Req, Get, Patch, Param, Request, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { DocumentManagerService } from '../services/document-manager.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('document')
@UseGuards(AuthGuard, RolesGuard)
export class DocumentManagerController {
  constructor(private readonly documentManagerService: DocumentManagerService) { }

  @Post('upload')
  @Roles('document:create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadDocument(@Req() request: Request, @UploadedFile(new ParseFilePipe({
    validators: [
      new FileTypeValidator({ fileType: 'application/pdf' }),
    ],
  })) file: Express.Multer.File) {
    const userId = request['user']['user_id'];
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
  updateDocument(@Req() request: Request, @Param('id') id: string, @UploadedFile(new ParseFilePipe({
    validators: [
      new FileTypeValidator({ fileType: 'application/pdf' }),
    ],
  })) file: Express.Multer.File) {
    const userId = request['user']['user_id'];
    return this.documentManagerService.updateDocument(id, file, userId);
  }

}
