import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/DB/prisma.service";

@Injectable()
export class AuthRepository {

    constructor(private readonly prismaSvc: PrismaService) { }

    login(email: string) {
        return this.prismaSvc.user.findFirst({
            where: { email }
        });
    }

    getUserById(userId: string) {
        return this.prismaSvc.user.findUnique({
            where: { id: userId },
            select:{
                role:true
            }
        });
    }
}