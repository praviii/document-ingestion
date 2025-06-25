import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/DB/prisma.service";

@Injectable()
export class AuthRepository {

    constructor(private prismaSvc: PrismaService) { }

    async login(email: string) {
        return this.prismaSvc.user.findFirst({
            where: { email }
        });
    }
}