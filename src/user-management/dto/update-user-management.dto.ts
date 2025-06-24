import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user-management.dto';

export class UpdateUserManagementDto extends PartialType(CreateUserDto) {}
