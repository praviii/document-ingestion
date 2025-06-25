import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../repository/auth.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private readonly authRepo: AuthRepository, private readonly jwtSvc: JwtService) { }

    async login(email: string, password: string) {
        const user = await this.authRepo.login(email);


        if (user) {
            const isValid = bcrypt.compareSync(password, user.password);

            if (!isValid) {
                throw new Error("Invalid password");
            }

            const payload = { email: user.email, user_id: user.id, roles: ['document:read', 'document:create', 'document:update', 'document:delete'] };
            const token = this.jwtSvc.sign(payload);

            return { access_token: token, user: { email: user.email, id: user.id } };
        }
    }
}