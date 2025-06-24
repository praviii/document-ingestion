import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { AuthRepository } from "./repository/auth.repository";
import { PrismaService } from "src/DB/prisma.service";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'secretKey',
            signOptions: { expiresIn: '1h' },
        })
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService, AuthRepository,PrismaService
    ],
})

export class Authmodule { }