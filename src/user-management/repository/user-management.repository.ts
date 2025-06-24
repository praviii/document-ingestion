import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/DB/prisma.service";
import { CreateUserDto } from "../dto/create-user-management.dto";

@Injectable()
export class UserManagementRepository {
    constructor(private prismaSvc: PrismaService) { }
    
    createUser(userData: CreateUserDto) {
        return this.prismaSvc.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                roleId: userData.roleId,
            }
        })
    }
}