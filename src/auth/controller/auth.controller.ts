import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../service/auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authSvc : AuthService) { }

    @Post('login')
    login(@Body() body: { email: string, password: string }) {
        return this.authSvc.login(body.email, body.password);
    }
}