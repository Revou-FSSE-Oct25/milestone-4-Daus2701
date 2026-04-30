import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { DepositDto } from '../account/dto/deposit.dto';
import { TransferDto } from '../account/dto/transfer.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  deposit(@Body() body: DepositDto) {
    return this.transactionService.deposit(body.accountId, body.amount);
  }

  @Post('transfer')
  transfer(@Body() body: TransferDto) {
    return this.transactionService.transfer(
      body.fromId,
      body.toId,
      body.amount,
    );
  }

  @Post('withdraw')
  withdraw(@Body() body: DepositDto) {
    return this.transactionService.withdraw(body.accountId, body.amount);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll('TEMP_USER_ID');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }
}