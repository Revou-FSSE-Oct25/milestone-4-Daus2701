import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts')
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

}