import { Controller, Post, Body, Get } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('create')
  create(@Body() body: { userId: string }) {
    return this.accountService.create(body.userId);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Post('deposit')
  deposit(@Body() body: { accountId: string; amount: number }) {
    return this.accountService.deposit(body.accountId, body.amount);
  }

  @Post('transfer')
  transfer(
    @Body()
    body: { fromId: string; toId: string; amount: number },
  ) {
    return this.accountService.transfer(
      body.fromId,
      body.toId,
      body.amount,
    );
  }
}