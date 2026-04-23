import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuard } from './auth/jwt/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  checkHealth(): string {
    return this.appService.getHealth();
  }

  @UseGuards(JwtGuard)
  @Get('protected')
  getProtected(@Req() req) {
    return { 
      message: 'You are authenticated!',
      user: req.user,
     };
  }
}