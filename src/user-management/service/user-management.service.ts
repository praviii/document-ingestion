import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async getAllUsers(): Promise<User[]> {
    this.logger.log('Retrieving all users');
    try {
      const users = await this.userManagementRepoSvc.getAllUsers();
      return users.map(user => {
        const userModel = new User();
        userModel.id = user.id;
        userModel.name = user.name;
        userModel.email = user.email;
        userModel.role = user.role ? user.role.name : '';
        return userModel;
      });
    } catch (error) {
      this.logger.error('Error retrieving users: ' + error.message);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    this.logger.log(`Retrieving user by ID: ${id}`);
    try {
      const user = await this.userManagementRepoSvc.getUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userModel = new User();
      userModel.id = user.id;
      userModel.name = user.name;
      userModel.email = user.email;
      userModel.role = user.role ? user.role.name : '';
      return userModel;
    } catch (error) {
      this.logger.error(`Error retrieving user by ID ${id}: ` + error.message);
      throw error;
    }
  }

}
