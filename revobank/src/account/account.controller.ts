import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() body: CreateAccountDto) {
    return this.accountService.create(body.userId);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Post('deposit')
  deposit(@Body() body: DepositDto) {
    return this.accountService.deposit(body.accountId, body.amount);
  }

  @Post('transfer')
  transfer(@Body() body: TransferDto) {
    return this.accountService.transfer(
      body.fromId,
      body.toId,
      body.amount,
    );
  }
}