import { Controller,Post, Body, Get } from '@nestjs/common';
import { UserManagementService } from '../service/user-management.service';
import { CreateUserDto } from '../dto/create-user-management.dto';
import { successResponse } from 'src/common/helpers/response.helper';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { User } from '../model/user.model';

@Controller('user')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) { }

  @Post('/register')
  async createUser(@Body() data: CreateUserDto): Promise<ApiResponse<User>> {
    const res = await this.userManagementService.createUser(data);
    return successResponse(res, 'User created successfully');
  }

  @Get('/all')
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    const res = await this.userManagementService.getAllUsers();
    return successResponse(res, 'Users retrieved successfully');
  }

  @Get(':id')
  async getUserById(@Body('id') id: string): Promise<ApiResponse<User>> {
    const res = await this.userManagementService.getUserById(id);
    return successResponse(res, 'User retrieved successfully');
  }
}
