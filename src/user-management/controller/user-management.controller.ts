import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserManagementService } from '../service/user-management.service';
import { CreateUserDto } from '../dto/create-user-management.dto';
import { UpdateUserManagementDto } from '../dto/update-user-management.dto';
import { successResponse } from 'src/common/helpers/response.helper';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { User } from '../model/user.model';

@Controller('user')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) { }

  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<ApiResponse<User>> {
    const res = await this.userManagementService.createUser(data);
    return successResponse(res, 'User created successfully');
  }
}
