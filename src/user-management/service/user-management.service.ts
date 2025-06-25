import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user-management.dto';
import { UserManagementRepository } from '../repository/user-management.repository';
import * as bcrypt from 'bcrypt';
import { User } from '../model/user.model';

@Injectable()
export class UserManagementService {

  logger = new Logger(UserManagementService.name);
  constructor(private readonly userManagementRepoSvc: UserManagementRepository) { }

  async createUser(userData: CreateUserDto) {
  this.logger.log('Creating user with data: ' + JSON.stringify(userData));
  try {
    if (!userData.password) {
      throw new Error('Password is required');
    }


    const pass = await bcrypt.hash(userData.password, 10);
    userData.password = pass;

    const res = await this.userManagementRepoSvc.createUser(userData);
    const user = new User();

    user.name = res.name;
    user.email = res.email;

    return user;
  } catch (error) {
    this.logger.error('Error creating user: ' + error.message);
    throw error;
  }
}

}
