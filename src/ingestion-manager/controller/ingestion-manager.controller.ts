import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IngestionManagerService } from '../service/ingestion-manager.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

UseGuards(AuthGuard, RolesGuard)
@Controller('ingestion')
export class IngestionManagerController {
  constructor(private readonly ingestionManagerService: IngestionManagerService) { }

  @Get(':id')
  @Roles('ingestion:read')
  async getIngestionById(@Param('id')id: string) {
    return this.ingestionManagerService.getIngestionById(id);
  }
}
