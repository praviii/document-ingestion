import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../DB/prisma.service";
import { CreateUserDto } from "../dto/create-user-management.dto";

@Injectable()
export class UserManagementRepository {
    constructor(private readonly prismaSvc: PrismaService) { }
    
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

    getAllUsers() {
        return this.prismaSvc.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role:{
                    select: {
                        name: true
                    }
                }
            }
        });
    }

    getUserById(id: string) {
        return this.prismaSvc.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: {
                    select: {
                        name: true
                    }
                }
            }
        });
    }
}