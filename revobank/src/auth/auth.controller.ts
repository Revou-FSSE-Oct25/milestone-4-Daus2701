import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/jwt.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() body: any) {
    return this.authService.register(body);
    }

    @Post('login')
    login(@Body() body: any) {
        return this.authService.login(body);
    }

    @Post('refresh')
    refresh(@Body() body: any) {
        return this.authService.refresh(body.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtGuard)
    logout(@Req() req) {
        return this.authService.logout(req.user.sub);
    }

    @Post('admin-only')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    adminOnly(@Req() req) {
        return {
            message: 'Welcome Admin!',
            user: req.user,
        };
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('update-role')
    updateRole(@Body() body: any) {
        return this.authService.updateRole(
            body.userId,
            body.role as Role,
        );
    }
}